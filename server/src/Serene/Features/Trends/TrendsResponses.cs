using NodaTime;

namespace Serene.Features.Trends;

public record TrendsResponse
{
    public int Year { get; init; }
    public MoodBreakdownData MoodBreakdown { get; init; } = new();
    public List<MoodCalendarMonth> MoodCalendar { get; init; } = [];
    public List<TopActivityItem> TopActivities { get; init; } = [];
    public List<EnergyLevelPoint> EnergyLevels { get; init; } = [];
}

public record MoodBreakdownData
{
    public List<MoodCount> ThisYear { get; init; } = [];
    public List<MoodCount> PreviousYear { get; init; } = [];
}

public record MoodCount
{
    public string MoodLabel { get; init; } = string.Empty;
    public int Count { get; init; }
    public double AverageSeverity { get; init; }
}

public record MoodCalendarMonth
{
    public int Month { get; init; }
    public string MonthName { get; init; } = string.Empty;
    public List<MoodCalendarDay> Days { get; init; } = [];
}

public record MoodCalendarDay
{
    public int Day { get; init; }
    public string? MoodLabel { get; init; }
    public int? MoodSeverity { get; init; }
}

public record TopActivityItem
{
    public string Activity { get; init; } = string.Empty;
    public int Count { get; init; }
    public double Percentage { get; init; }
}

public record EnergyLevelPoint
{
    public int Month { get; init; }
    public string MonthName { get; init; } = string.Empty;
    public double AverageLevel { get; init; }
}
