namespace Serene.Features.Feedback;

public class FeedbackDto
{
    public string Date { get; set; }
    public string UserId { get; set; }
    public string Message { get; set; }
}

public class FeedbackListResponse
{
    public List<FeedbackDto> Feedback { get; set; } = new();
}
