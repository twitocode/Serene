using Microsoft.EntityFrameworkCore;
using NodaTime;
using NodaTime.Extensions;
using Serene.Common;
using Serene.Data;

namespace Serene.Services;

public interface IStreakService
{
    Task UpdateStreakAsync(string userId);
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

    public async Task UpdateStreakAsync(string userId)
    {
        _logger.LogInformation("Updating streak for user: {UserId}", userId);

        var profile =
            await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId)
            ?? throw new AppException("Profile not found", ErrorCodes.NotFound);

        // Get the user's timezone
        var zone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
        var now = SystemClock.Instance.GetCurrentInstant();
        var today = now.InZone(zone).Date;

        // Get all completed check-ins for this user, ordered by date
        var completedCheckins = await _context
            .Checkins.Where(c => c.UserId == userId && c.DateCompleted != null)
            .OrderByDescending(c => c.DateCompleted)
            .Select(c => c.DateCompleted!.Value)
            .ToListAsync();

        if (completedCheckins.Count == 0)
        {
            _logger.LogWarning("No completed check-ins found for user {UserId}", userId);
            return;
        }

        var checkinDates = completedCheckins
            .Select(instant => instant.InZone(zone).Date)
            .Distinct()
            .OrderByDescending(d => d)
            .ToList();

        int currentStreak = 1;
        var previousDate = today;

        foreach (var checkinDate in checkinDates.Skip(0))
        {
            if (checkinDate == previousDate)
            {
                previousDate = checkinDate.PlusDays(-1);
                continue;
            }
            else if (checkinDate == previousDate.PlusDays(-1))
            {
                currentStreak++;
                previousDate = checkinDate.PlusDays(-1);
            }
            else
            {
                break;
            }
        }

        profile.CurrentStreak = currentStreak;
        if (currentStreak > profile.LongestStreak)
        {
            profile.LongestStreak = currentStreak;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Updated streak for user {UserId}: Current={CurrentStreak}, Longest={LongestStreak}",
            userId,
            currentStreak,
            profile.LongestStreak
        );
    }
}
