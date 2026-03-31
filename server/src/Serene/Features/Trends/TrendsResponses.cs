using NodaTime;

namespace Serene.Features.Trends;

public record TrendsResponse
{
    public int Year { get; init; }
    public MoodBreakdownData MoodBreakdown { get; init; } = new();
    public List<MoodCalendarMonth> MoodCalendar { get; init; } = [];
    public List<TopActivityItem> TopActivities { get; init; } = [];
    public List<EnergyLevelPoint> EnergyLevels { get; init; } = [];
    public SomaticData SomaticData { get; init; } = new();
    public List<ActivityImpactItem> ActivityImpact { get; init; } = [];
    public CommunityStats CommunityStats { get; init; } = new();
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

public record SomaticData
{
    public Dictionary<string, int> PartCounts { get; init; } = [];
    public List<SensationCount> TopSensations { get; init; } = [];
}

public record SensationCount
{
    public string Sensation { get; init; } = string.Empty;
    public int Count { get; init; }
}

public record ActivityImpactItem
{
    public string Activity { get; init; } = string.Empty;
    public double MoodImprovement { get; init; }
}

public record CommunityStats
{
    public int AnswersCount { get; init; }
    public int MatchesCount { get; init; }
    public int SupportCount { get; init; }
}
