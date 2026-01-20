using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;
using Pgvector;

namespace Serene.Entities;

public enum ExploreContentType
{
    Article,
    Video,
}

[Table("explore_content")]
public class ExploreContent
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("title")]
    [Required]
    public string Title { get; set; } = string.Empty;

    [Column("description")]
    public string Description { get; set; } = string.Empty;

    [Column("url")]
    [Required]
    public string Url { get; set; } = string.Empty;

    [Column("type")]
    public ExploreContentType Type { get; set; }

    [Column("embedding", TypeName = "vector(1024)")]
    public Vector? Embedding { get; set; }

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}
