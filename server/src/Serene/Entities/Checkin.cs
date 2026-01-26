using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;

namespace Serene.Entities;

[Table("checkins")]
public class Checkin
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("mood_label")]
    [Required]
    public string MoodLabel { get; set; } = string.Empty;

    [Column("mood_severity")]
    public int MoodSeverity { get; set; } = 5;

    [Column("prompt_question")]
    [Required]
    public string PromptQuestion { get; set; } = string.Empty;

    [Column("prompt_answer")]
    public string? PromptAnswer { get; set; }

    [Column("lingering_thoughts")]
    public string? LingeringThoughts { get; set; }

    [Column("reframed_thought")]
    public string? ReframedThought { get; set; }

    [Column("somatic_state", TypeName = "jsonb")]
    public Dictionary<string, GridPoint>? SomaticState { get; set; }

    /// <summary>
    /// Encrypted JSON representation of SomaticState for secure storage.
    /// </summary>
    [Column("somatic_state_encrypted")]
    public string? SomaticStateEncrypted { get; set; }

    [Column("date_completed")]
    public Instant? DateCompleted { get; set; }

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}

public class GridPoint
{
    //Normalized coordinates
    public float X { get; set; }
    public float Y { get; set; }

    public List<string> Sensations { get; set; } = [];
}
