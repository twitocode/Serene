using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;

namespace Serene.Entities;

[Table("scheduled_activities")]
public class ScheduledActivity
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("title")]
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Column("category")]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Column("scheduled_date")]
    public LocalDate ScheduledDate { get; set; }

    [Column("completed")]
    public bool Completed { get; set; } = false;

    [Column("completed_at")]
    public Instant? CompletedAt { get; set; }

    [Column("mood_before")]
    public int? MoodBefore { get; set; }

    [Column("mood_after")]
    public int? MoodAfter { get; set; }

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}
