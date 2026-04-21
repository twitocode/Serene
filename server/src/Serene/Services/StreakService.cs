using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Common;
using Serene.Data;

namespace Serene.Services;

public interface IStreakService
{
    Task UpdateStreakAsync(string userId, LocalDate? checkinDate = null);
}

public class StreakService : IStreakService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<StreakService> _logger;

    public StreakService(ApplicationDbContext context, ILogger<StreakService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task UpdateStreakAsync(string userId, LocalDate? checkinDate = null)
    {
        _logger.LogInformation("Updating streak for user: {UserId}", userId);

        var profile =
            await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new AppException("Profile not found", ErrorCodes.NotFound);

        // Get the user's timezone
        var zone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
        var now = SystemClock.Instance.GetCurrentInstant();
        var today = now.InZone(zone).Date;

        // If a checkinDate is provided and it's not today, we don't update the streak
        if (checkinDate.HasValue && checkinDate.Value != today)
        {
            _logger.LogInformation(
                "Check-in date {CheckinDate} is not today {Today}. Skipping streak update.",
                checkinDate.Value,
                today
            );
            return;
        }

        // Get all completed check-ins for this user, ordered by date
        var completedCheckins = await _context
            .Checkins.Where(c => c.UserId == userId && c.DateCompleted != null)
            .OrderByDescending(c => c.DateCompleted)
            .Select(c => c.DateCompleted!.Value)
            .ToListAsync();

        if (completedCheckins.Count == 0)
        {
            _logger.LogWarning("No completed check-ins found for user {UserId}", userId);
            profile.CurrentStreak = 0;
            await _context.SaveChangesAsync();
            return;
        }

        var checkinDates = completedCheckins
            .Select(instant => instant.InZone(zone).Date)
            .Distinct()
            .OrderByDescending(d => d)
            .ToList();

        var mostRecentCheckin = checkinDates[0];

        // If the user hasn't checked in today, the streak might still be active if they checked in yesterday.
        // But here we are usually calling this AFTER a check-in was made.
        // If we are calling this from login, mostRecentCheckin might be yesterday.

        int streak = 0;
        LocalDate? expectedDate = null;

        foreach (var date in checkinDates)
        {
            if (expectedDate == null)
            {
                if (date == today || date == today.PlusDays(-1))
                {
                    streak = 1;
                    expectedDate = date.PlusDays(-1);
                }
                else
                {
                    // Too old to start/continue a streak ending today/yesterday
                    break;
                }
            }
            else
            {
                if (date == expectedDate)
                {
                    streak++;
                    expectedDate = date.PlusDays(-1);
                }
                else
                {
                    break;
                }
            }
        }

        profile.CurrentStreak = streak;
        if (streak > profile.LongestStreak)
        {
            profile.LongestStreak = streak;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Updated streak for user {UserId}: Current={CurrentStreak}, Longest={LongestStreak}",
            userId,
            streak,
            profile.LongestStreak
        );
    }
}
