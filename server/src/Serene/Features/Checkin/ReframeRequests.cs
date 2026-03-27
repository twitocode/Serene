namespace Serene.Features.Checkins;

public class ReframeRequest
{
    public required string LingeringThoughts { get; set; }
}

public class ReframeResponse
{
    public required string Distortion { get; set; }
    public required string SocraticQuestion { get; set; }
    public required string SuggestedReframe { get; set; }
}
