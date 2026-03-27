using NodaTime;
using Serene.Entities;

namespace Serene.Features.Checkins;

public class CompleteCheckinRequest
{
    public required string MoodLabel { get; set; }
    public string? PromptQuestion { get; set; }
    public string? PromptAnswer { get; set; }
    public Dictionary<string, GridPoint> SomaticState { get; set; } = [];
    public string? LingeringThoughts { get; set; }
    public string? ReframedThought { get; set; }
    public required int MoodSeverity { get; set; }
}
