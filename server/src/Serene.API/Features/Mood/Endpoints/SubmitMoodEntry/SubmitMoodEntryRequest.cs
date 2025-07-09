namespace Serene.API.Features.Mood.Endpoints.SubmitMoodEntry;

public record SubmitMoodEntryRequest()
{
    public string OverallMood { get; init; } = string.Empty;
    public string EnergyLevel { get; init; } = string.Empty;
    public string? BestPartOfDay { get; init; } 
    public string? WorstPartOfDay { get; init; } 
    public bool HadPhysicalOrEmotionalDiscomfort { get; init; }
}