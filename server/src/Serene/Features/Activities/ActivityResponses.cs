namespace Serene.Features.Activities;

public class ActivityResponse
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Category { get; set; }
    public required string ScheduledDate { get; set; }
    public required bool Completed { get; set; }
    public string? CompletedAt { get; set; }
    public int? MoodBefore { get; set; }
    public int? MoodAfter { get; set; }
}
