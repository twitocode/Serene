using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NodaTime;

namespace Serene.Entities;

public class User : IdentityUser
{
    [Column("name")]
    public string? Name { get; set; }

    [Column("image")]
    public string? Image { get; set; }

    [Column("date_of_birth")]
    public LocalDate? DateOfBirth { get; set; }

    [Column("gender")]
    public string Gender { get; set; } = string.Empty;

    [Column("pronouns")]
    public string Pronouns { get; set; } = string.Empty;

    [Column("country_code")]
    [MaxLength(2)]
    public string? CountryCode { get; set; }

    [Column("onboarding_completed")]
    public bool OnboardingCompleted { get; set; } = false;

    [Column("onboarding_step")]
    public int OnboardingStep { get; set; } = 1;

    [Column("onboarding_started")]
    public bool OnboardingStarted { get; set; } = false;

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    public Profile? Profile { get; set; }
    public SafetyPlan? SafetyPlan { get; set; }
    public Settings? Settings { get; set; }
    public ICollection<UserAchievement> UserAchievements { get; set; } =
        new List<UserAchievement>();
    public ICollection<Checkin> Checkins { get; set; } = new List<Checkin>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
    public ICollection<UserInterest> Interests { get; set; } = new List<UserInterest>();
}

[Table("verification")]
public class Verification
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("identifier")]
    [Required]
    public string Identifier { get; set; } = string.Empty;

    [Column("value")]
    [Required]
    public string Value { get; set; } = string.Empty;

    [Column("expires_at")]
    public Instant ExpiresAt { get; set; }

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}
