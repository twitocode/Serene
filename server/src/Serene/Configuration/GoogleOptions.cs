namespace Serene.Configuration;

public class GoogleOptions
{
    public const string SectionName = "Authentication:Google";

    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string FeedbackSheetId { get; set; } = string.Empty;
    public string ServiceAccount { get; set; } = string.Empty;
}
