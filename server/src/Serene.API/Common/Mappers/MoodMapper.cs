namespace Serene.API.Common.Mappers;

using Serene.API.Data.Entities;
using Serene.API.Features.Mood.Endpoints.SubmitMoodEntry;

public static class MoodMapper
{
    public static SubmitMoodEntryResponse ToSubmitMoodEntry(this MoodEntry entry)
    {
        return new SubmitMoodEntryResponse(entry.BestPartOfDay, entry.WorstPartOfDay, entry.OverallMood.ToString(),
            entry.EnergyLevel.ToString(), entry.HadPhysicalOrEmotionalDiscomfort);
    }
}