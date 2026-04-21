namespace Serene.Features.Feedback;

public class FeedbackDto
{
    public required string Date { get; set; }
    public required string UserId { get; set; }
    public required string Message { get; set; }
}

public class FeedbackListResponse
{
    public List<FeedbackDto> Feedback { get; set; } = new();
}
