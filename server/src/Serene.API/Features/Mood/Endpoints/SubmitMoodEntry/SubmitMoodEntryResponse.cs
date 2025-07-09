namespace Serene.API.Features.Mood.Endpoints.SubmitMoodEntry;

public record SubmitMoodEntryResponse(
    string? BestPartOfDay,
    string? WorstPartOfDay,
    string OverallMood,
    string EnergyLevel,
    bool HadPhysicalOrEmotionalDiscomfort);