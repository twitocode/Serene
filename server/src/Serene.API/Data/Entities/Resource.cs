using NodaTime;

namespace Serene.API.Data.Entities;

public enum ResourceType
{
    Article,
    Video
}

public class Resource : IEntity
{
    public string? MarkdownLink { get; init; }
    public string Title { get; init; }
    public string Summary { get; init; }
    public string? Thumbnail { get; init; }
    public string Author { get; init; } = "Serene Team";
    public ResourceType ResourceType { get; init; }

    public List<User> Users { get; set; } 

    public Guid Id { get; set; }
    public Instant CreatedAt { get; set; }
}