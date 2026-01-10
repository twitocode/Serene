namespace Serene.DTOs.Requests;

public class CreateExploreContentRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = "Article";
    public string Tags { get; set; } = string.Empty;
}

public class ScrapeRequest
{
    public string Url { get; set; } = string.Empty;
}