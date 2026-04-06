using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Serene.Entities;

[Table("school_club")]
public class SchoolClub
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

    [Column("summary")]
    [Required]
    public string Summary { get; set; } = string.Empty;

    [Column("tags")]
    public string? Tags { get; set; }

    [Column("links")]
    public string? Links { get; set; }

    [Column("user_id")]
    [Required]
    public string UserId { get; set; } = string.Empty;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("SchoolId")]
    public School School { get; set; } = null!;

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}
