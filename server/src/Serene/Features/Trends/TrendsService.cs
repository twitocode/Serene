using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;

namespace Serene.Features.Trends;

public interface ITrendsService
{
    Task<TrendsResponse> GetTrendsAsync(string userId, int year);
}

public class TrendsService : ITrendsService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TrendsService> _logger;

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

    public TrendsService(ApplicationDbContext context, ILogger<TrendsService> logger)
    {
        _context = context;
        _logger = logger;
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

        // Calculate mood breakdown
        var moodBreakdown = new MoodBreakdownData
        {
            ThisYear = thisYearCheckins
                .GroupBy(c => c.MoodLabel)
                .Select(g => new MoodCount
                {
                    MoodLabel = g.Key,
                    Count = g.Count(),
                    AverageSeverity = g.Average(c => c.MoodSeverity),
                })
                .OrderByDescending(m => m.Count)
                .ToList(),
            PreviousYear = prevYearCheckins
                .GroupBy(c => c.MoodLabel)
                .Select(g => new MoodCount
                {
                    MoodLabel = g.Key,
                    Count = g.Count(),
                    AverageSeverity = g.Average(c => c.MoodSeverity),
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
                            ? Math.Round(monthCheckins.Average(c => c.MoodSeverity), 1)
                            : 0,
                };
            })
            .ToList();

        return new TrendsResponse
        {
            Year = year,
            MoodBreakdown = moodBreakdown,
            MoodCalendar = moodCalendar,
            TopActivities = topActivities,
            EnergyLevels = energyLevels,
        };
    }
}
