using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.Entities;

namespace Serene.Services;

public interface IAchievementService
{
    Task<List<AchievementWithStatus>> GetAllAchievementsAsync(string userId);
    Task CheckAndGrantAchievementsAsync(string userId);
}

public class AchievementWithStatus
{
    public required string Id { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required int Points { get; set; }
    public bool Unlocked { get; set; }
    public Instant? UnlockedAt { get; set; }
}

public class AchievementService : IAchievementService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AchievementService> _logger;

    public AchievementService(ApplicationDbContext context, ILogger<AchievementService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<AchievementWithStatus>> GetAllAchievementsAsync(string userId)
    {
        var achievements = await _context.Achievements.ToListAsync();
        var userAchievements = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .ToDictionaryAsync(ua => ua.AchievementId, ua => ua.UnlockedAt);

        return achievements.Select(a => new AchievementWithStatus
        {
            Id = a.Id,
            Slug = a.Slug,
            Title = a.Title,
            Description = a.Description,
            Points = a.Points,
            Unlocked = userAchievements.ContainsKey(a.Id),
            UnlockedAt = userAchievements.GetValueOrDefault(a.Id),
        })
        .OrderByDescending(a => a.Unlocked)
        .ThenBy(a => a.Points)
        .ToList();
    }

    public async Task CheckAndGrantAchievementsAsync(string userId)
    {
        var existing = await _context.UserAchievements
            .Where(ua => ua.UserId == userId)
            .Select(ua => ua.Achievement.Slug)
            .ToHashSetAsync();

        var allAchievements = await _context.Achievements.ToListAsync();

        var checkinCount = await _context.Checkins.CountAsync(c => c.UserId == userId);
        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        var currentStreak = profile?.CurrentStreak ?? 0;
        var longestStreak = profile?.LongestStreak ?? 0;

        var activityCount = await _context.ScheduledActivities
            .CountAsync(a => a.UserId == userId && a.Completed);

        var reframeCount = await _context.Checkins
            .CountAsync(c => c.UserId == userId && c.ReframedThought != null && c.ReframedThought != "");

        foreach (var achievement in allAchievements)
        {
            if (existing.Contains(achievement.Slug)) continue;

            bool earned = achievement.Slug switch
            {
                "first-checkin" => checkinCount >= 1,
                "streak-3" => longestStreak >= 3,
                "streak-7" => longestStreak >= 7,
                "streak-14" => longestStreak >= 14,
                "streak-30" => longestStreak >= 30,
                "checkin-10" => checkinCount >= 10,
                "checkin-25" => checkinCount >= 25,
                "checkin-50" => checkinCount >= 50,
                "checkin-100" => checkinCount >= 100,
                "first-reframe" => reframeCount >= 1,
                "reframe-10" => reframeCount >= 10,
                "first-activity" => activityCount >= 1,
                "activity-10" => activityCount >= 10,
                "activity-25" => activityCount >= 25,
                _ => false,
            };

            if (earned)
            {
                _context.UserAchievements.Add(new UserAchievement
                {
                    UserId = userId,
                    AchievementId = achievement.Id,
                });
                _logger.LogInformation("Granted achievement {Slug} to user {UserId}", achievement.Slug, userId);
            }
        }

        await _context.SaveChangesAsync();
    }
}
