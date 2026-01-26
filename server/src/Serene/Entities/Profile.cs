using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NodaTime;

namespace Serene.Entities;

[Table("profile")]
public class Profile
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("mochi_name")]
    [Required]
    public string MochiName { get; set; } = string.Empty;

    [Column("mochi_pronouns")]
    [MaxLength(50)]
    public string MochiPronouns { get; set; } = "They/Them";

    [Column("struggles")]
    public List<string> Struggles { get; set; } = new List<string>();

    [Column("current_streak")]
    public int CurrentStreak { get; set; } = 0;

    [Column("longest_streak")]
    public int LongestStreak { get; set; } = 0;

    [Column("school_id")]
    public string? SchoolId { get; set; }
    public School? School { get; set; }

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}

[Table("safety_plan")]
public class SafetyPlan
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("professional_resources", TypeName = "jsonb")]
    public string? ProfessionalResources { get; set; }

    [Column("safe_contacts", TypeName = "jsonb")]
    public string? SafeContacts { get; set; }

    [Column("coping_strategies")]
    public List<string> CopingStrategies { get; set; } = new List<string>();

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}
