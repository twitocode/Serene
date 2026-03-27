using Microsoft.EntityFrameworkCore;
using NodaTime;
using NodaTime.Text;
using Serene.Data;
using Serene.Entities;
using Serene.Services;

namespace Serene.Features.Activities;

public interface IActivityService
{
    Task<List<ActivityResponse>> GetActivitiesAsync(string userId, LocalDate? from, LocalDate? to);
    Task<ActivityResponse> CreateActivityAsync(string userId, CreateActivityRequest dto);
    Task<ActivityResponse> CompleteActivityAsync(
        string userId,
        string activityId,
        CompleteActivityRequest dto
    );
    Task DeleteActivityAsync(string userId, string activityId);
}

public class ActivityService : IActivityService
{
    private readonly ApplicationDbContext _context;
    private readonly IAchievementService _achievementService;

    public ActivityService(ApplicationDbContext context, IAchievementService achievementService)
    {
        _context = context;
        _achievementService = achievementService;
    }

    public async Task<List<ActivityResponse>> GetActivitiesAsync(
        string userId,
        LocalDate? from,
        LocalDate? to
    )
    {
        var query = _context.ScheduledActivities.Where(a => a.UserId == userId);

        if (from.HasValue)
            query = query.Where(a => a.ScheduledDate >= from.Value);
        if (to.HasValue)
            query = query.Where(a => a.ScheduledDate <= to.Value);

        return await query
            .OrderBy(a => a.ScheduledDate)
            .ThenBy(a => a.CreatedAt)
            .Select(a => MapToResponse(a))
            .ToListAsync();
    }

    public async Task<ActivityResponse> CreateActivityAsync(
        string userId,
        CreateActivityRequest dto
    )
    {
        var parseResult = LocalDatePattern.Iso.Parse(dto.ScheduledDate);
        if (!parseResult.Success)
            throw new ArgumentException("Invalid date format. Use yyyy-MM-dd");

        var activity = new ScheduledActivity
        {
            UserId = userId,
            Title = dto.Title.Trim(),
            Category = dto.Category?.Trim() ?? string.Empty,
            ScheduledDate = parseResult.Value,
        };

        _context.ScheduledActivities.Add(activity);
        await _context.SaveChangesAsync();

        return MapToResponse(activity);
    }

    public async Task<ActivityResponse> CompleteActivityAsync(
        string userId,
        string activityId,
        CompleteActivityRequest dto
    )
    {
        var activity =
            await _context.ScheduledActivities.FirstOrDefaultAsync(a =>
                a.Id == activityId && a.UserId == userId
            ) ?? throw new KeyNotFoundException("Activity not found");

        activity.Completed = true;
        activity.CompletedAt = SystemClock.Instance.GetCurrentInstant();
        activity.MoodBefore = dto.MoodBefore;
        activity.MoodAfter = dto.MoodAfter;

        await _context.SaveChangesAsync();

        await _achievementService.CheckAndGrantAchievementsAsync(userId);

        return MapToResponse(activity);
    }

    public async Task DeleteActivityAsync(string userId, string activityId)
    {
        var activity =
            await _context.ScheduledActivities.FirstOrDefaultAsync(a =>
                a.Id == activityId && a.UserId == userId
            ) ?? throw new KeyNotFoundException("Activity not found");

        _context.ScheduledActivities.Remove(activity);
        await _context.SaveChangesAsync();
    }

    private static ActivityResponse MapToResponse(ScheduledActivity a) =>
        new()
        {
            Id = a.Id,
            Title = a.Title,
            Category = a.Category,
            ScheduledDate = a.ScheduledDate.ToString(),
            Completed = a.Completed,
            CompletedAt = a.CompletedAt?.ToString(),
            MoodBefore = a.MoodBefore,
            MoodAfter = a.MoodAfter,
        };
}
