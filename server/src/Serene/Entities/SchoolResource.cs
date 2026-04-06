using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Serene.Entities;

[Table("school_resource")]
public class SchoolResource
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("school_id")]
    [Required]
    public string SchoolId { get; set; } = string.Empty;

    [Column("name")]
    [Required]
    public string Name { get; set; } = string.Empty;

    [Column("url")]
    [Required]
    public string Url { get; set; } = string.Empty;

    [Column("type")]
    [Required]
    public string Type { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("SchoolId")]
    public School School { get; set; } = null!;
}
