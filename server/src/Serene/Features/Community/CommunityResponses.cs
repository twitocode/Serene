namespace Serene.Features.Community;

public class PostResponse
{
    public required string UserId { get; set; }
    public required string Username { get; set; }
    public required string Answer { get; set; }
}

public class QOTDResponse
{
    public required string QOTDId { get; set; }
    public required string Question { get; set; }
}
