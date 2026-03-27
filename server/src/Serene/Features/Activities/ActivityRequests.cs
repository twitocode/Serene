namespace Serene.Features.Activities;

public class CreateActivityRequest
{
    public required string Title { get; set; }
    public string? Category { get; set; }
    public required string ScheduledDate { get; set; }
}

public class CompleteActivityRequest
{
    public int? MoodBefore { get; set; }
    public int? MoodAfter { get; set; }
}
