using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.Services;

namespace Serene.Features.Trends;

public interface ITrendsService
{
    Task<TrendsResponse> GetTrendsAsync(string userId, int year);
}

public class TrendsService : ITrendsService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TrendsService> _logger;
    private readonly IEncryptionService _encryption;

    private static readonly string[] MonthNames =
    [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    public TrendsService(
        ApplicationDbContext context,
        ILogger<TrendsService> logger,
        IEncryptionService encryption
    )
    {
        _context = context;
        _logger = logger;
        _encryption = encryption;
    }

    public async Task<TrendsResponse> GetTrendsAsync(string userId, int year)
    {
        _logger.LogInformation("Getting trends for user {UserId} for year {Year}", userId, year);

        var zone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
        var startOfYear = new LocalDate(year, 1, 1).AtStartOfDayInZone(zone).ToInstant();
        var endOfYear = new LocalDate(year + 1, 1, 1).AtStartOfDayInZone(zone).ToInstant();
        var startOfPrevYear = new LocalDate(year - 1, 1, 1).AtStartOfDayInZone(zone).ToInstant();

        var thisYearCheckins = await _context
            .Checkins.Where(c =>
                c.UserId == userId && c.DateCompleted >= startOfYear && c.DateCompleted < endOfYear
            )
            .ToListAsync();

        var prevYearCheckins = await _context
            .Checkins.Where(c =>
                c.UserId == userId
                && c.DateCompleted >= startOfPrevYear
                && c.DateCompleted < startOfYear
            )
            .ToListAsync();

        // Decrypt mood labels for correct grouping
        foreach (var c in thisYearCheckins)
        {
            c.MoodLabel = _encryption.Decrypt(c.MoodLabel) ?? c.MoodLabel;
        }

        foreach (var c in prevYearCheckins)
        {
            c.MoodLabel = _encryption.Decrypt(c.MoodLabel) ?? c.MoodLabel;
        }

        // Calculate mood breakdown
        var moodBreakdown = new MoodBreakdownData
        {
            ThisYear = thisYearCheckins
                .GroupBy(c => c.MoodLabel)
                .Select(g => new MoodCount
                {
                    MoodLabel = g.Key,
                    Count = g.Count(),
                    AverageSeverity = g.Average(c => (double)c.MoodSeverity),
                })
                .OrderByDescending(m => m.Count)
                .ToList(),
            PreviousYear = prevYearCheckins
                .GroupBy(c => c.MoodLabel)
                .Select(g => new MoodCount
                {
                    MoodLabel = g.Key,
                    Count = g.Count(),
                    AverageSeverity = g.Average(c => (double)c.MoodSeverity),
                })
                .OrderByDescending(m => m.Count)
                .ToList(),
        };

        var moodCalendar = Enumerable
            .Range(1, 12)
            .Select(month =>
            {
                var monthStart = new LocalDate(year, month, 1);
                var daysInMonth = monthStart.Calendar.GetDaysInMonth(year, month);

                return new MoodCalendarMonth
                {
                    Month = month,
                    MonthName = MonthNames[month - 1],
                    Days = Enumerable
                        .Range(1, daysInMonth)
                        .Select(day =>
                        {
                            var dayStart = new LocalDate(year, month, day)
                                .AtStartOfDayInZone(zone)
                                .ToInstant();
                            var dayEnd = new LocalDate(year, month, day)
                                .PlusDays(1)
                                .AtStartOfDayInZone(zone)
                                .ToInstant();
                            var dayCheckin = thisYearCheckins.FirstOrDefault(c =>
                                c.DateCompleted >= dayStart && c.DateCompleted < dayEnd
                            );

                            return new MoodCalendarDay
                            {
                                Day = day,
                                MoodLabel = dayCheckin?.MoodLabel,
                                MoodSeverity = dayCheckin?.MoodSeverity,
                            };
                        })
                        .ToList(),
                };
            })
            .ToList();

        var topActivities = thisYearCheckins
            .Where(c => !string.IsNullOrEmpty(c.PromptQuestion))
            .GroupBy(c => c.PromptQuestion)
            .Select(g => new { Activity = g.Key, Count = g.Count() })
            .OrderByDescending(a => a.Count)
            .Take(5)
            .Select(
                (a, _) =>
                    new TopActivityItem
                    {
                        Activity = a.Activity,
                        Count = a.Count,
                        Percentage =
                            thisYearCheckins.Count > 0
                                ? Math.Round((double)a.Count / thisYearCheckins.Count * 100, 1)
                                : 0,
                    }
            )
            .ToList();

        var energyLevels = Enumerable
            .Range(1, 12)
            .Select(month =>
            {
                var monthStart = new LocalDate(year, month, 1).AtStartOfDayInZone(zone).ToInstant();
                var monthEnd = new LocalDate(year, month, 1)
                    .PlusMonths(1)
                    .AtStartOfDayInZone(zone)
                    .ToInstant();
                var monthCheckins = thisYearCheckins
                    .Where(c => c.DateCompleted >= monthStart && c.DateCompleted < monthEnd)
                    .ToList();

                return new EnergyLevelPoint
                {
                    Month = month,
                    MonthName = MonthNames[month - 1],
                    AverageLevel =
                        monthCheckins.Count > 0
                            ? Math.Round(monthCheckins.Average(c => (double)c.MoodSeverity), 1)
                            : 0,
                };
            })
            .ToList();

        // New calculations
        var somaticPartCounts = new Dictionary<string, int>();
        var sensationCounts = new Dictionary<string, int>();

        foreach (var c in thisYearCheckins)
        {
            var somaticState = _encryption.DecryptJson<
                Dictionary<string, Serene.Entities.GridPoint>
            >(c.SomaticStateEncrypted);
            if (somaticState != null)
            {
                foreach (var entry in somaticState)
                {
                    somaticPartCounts[entry.Key] =
                        somaticPartCounts.GetValueOrDefault(entry.Key) + 1;
                    foreach (var sensation in entry.Value.Sensations)
                    {
                        sensationCounts[sensation] =
                            sensationCounts.GetValueOrDefault(sensation) + 1;
                    }
                }
            }
        }

        var somaticData = new SomaticData
        {
            PartCounts = somaticPartCounts,
            TopSensations = sensationCounts
                .OrderByDescending(s => s.Value)
                .Take(5)
                .Select(s => new SensationCount { Sensation = s.Key, Count = s.Value })
                .ToList(),
        };

        var activityImpact = thisYearCheckins
            .Where(c => !string.IsNullOrEmpty(c.PromptQuestion))
            .GroupBy(c => c.PromptQuestion)
            .Select(g => new ActivityImpactItem
            {
                Activity = g.Key,
                MoodImprovement = Math.Round(g.Average(c => (double)c.MoodSeverity) * 10, 1), // Using 0-10 scale as % for now
            })
            .OrderByDescending(a => a.MoodImprovement)
            .Take(5)
            .ToList();

        var answersCount = await _context.Posts.CountAsync(p => p.UserId == userId);
        var matchesCount = await _context.PeerMatches.CountAsync(m =>
            m.UserId == userId || m.MatchedUserId == userId
        );

        // Support count - still placeholder as not implemented in schema, but will return 0 for now
        var supportCount = 0;

        var communityStats = new CommunityStats
        {
            AnswersCount = answersCount,
            MatchesCount = matchesCount,
            SupportCount = supportCount,
        };

        return new TrendsResponse
        {
            Year = year,
            MoodBreakdown = moodBreakdown,
            MoodCalendar = moodCalendar,
            TopActivities = topActivities,
            EnergyLevels = energyLevels,
            SomaticData = somaticData,
            ActivityImpact = activityImpact,
            CommunityStats = communityStats,
        };
    }
}
