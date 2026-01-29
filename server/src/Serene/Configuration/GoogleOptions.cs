namespace Serene.Configuration;

public class GoogleOptions
{
    public const string SectionName = "Authentication:Google";

    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string FeedbackSheetId { get; set; } = string.Empty;
    public string ServiceAccount { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string SearchEngineId { get; set; } = string.Empty; // Deprecated

    // Vertex AI Search configuration
    public string VertexAIProjectId { get; set; } = string.Empty;
    public string VertexAILocation { get; set; } = "global";
    public string DataStoreId { get; set; } = string.Empty;
}
