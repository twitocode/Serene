namespace Serene.API.Features.Mood.Endpoints.PaginatedMoodEntries;

public record PaginatedMoodEntriesResponse
{
    public string OverallMood { get; init; }
    public string EnergyLevel { get; init; }
    
    //Only asked in journal entries
    public string? BestPartOfDay { get; init; } 
    public string? WorstPartOfDay { get; init; } 
    public bool HadPhysicalOrEmotionalDiscomfort { get; init; }
    
    public string CreatedAt { get; init; }
}
