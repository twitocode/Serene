using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NodaTime;

namespace Serene.Entities;

public enum Gender
{
    Male,
    Female,
    NonBinary,
    PreferNotToSay
}

public enum Theme
{
    Dark,
    Light
}

public class User : IdentityUser
{
    [Column("name")]
    public string? Name { get; set; }

    [Column("image")]
    public string? Image { get; set; }

    [Column("age")]
    public int Age { get; set; } = 0;

    [Column("gender")]
    public string Gender { get; set; } = "Prefer not to say";

    [Column("pronouns")]
    public string Pronouns { get; set; } = "They/Them";

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
    public Preferences? Preferences { get; set; }
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    public ICollection<Checkin> Checkins { get; set; } = new List<Checkin>();
    public ICollection<Post> Posts { get; set; } = new List<Post>();
}

[Table("profile")]
public class Profile
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("koala_name")]
    [Required]
    public string KoalaName { get; set; } = string.Empty;

    [Column("koala_color")]
    public string KoalaColour { get; set; } = "#5EEAD4";

    [Column("koala_pronouns")]
    [MaxLength(50)]
    public string KoalaPronouns { get; set; } = "They/Them";

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

[Table("preferences")]
public class Preferences
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("password_lock")]
    [MaxLength(50)]
    public string? PasswordLock { get; set; }

    [Column("theme")]
    public string Theme { get; set; } = "Light";

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}

[Table("school")]
public class School
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("name")]
    public string? Name { get; set; }

    [Column("country_code")]
    [Required]
    [MaxLength(2)]
    public string CountryCode { get; set; } = string.Empty;

    [Column("region_code")]
    [MaxLength(2)]
    public string? RegionCode { get; set; }

    [Column("city")]
    public string? City { get; set; }
}

[Table("achievements")]
public class Achievement
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("slug")]
    [Required]
    public string Slug { get; set; } = string.Empty;

    [Column("title")]
    [Required]
    public string Title { get; set; } = string.Empty;

    [Column("points")]
    public int Points { get; set; } = 0;
}

[Table("user_achievements")]
public class UserAchievement
{
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("achievement_id")]
    public string AchievementId { get; set; } = string.Empty;
    public Achievement Achievement { get; set; } = null!;

    [Column("unlocked_at")]
    public Instant UnlockedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}

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

    [Column("somatic_state", TypeName = "jsonb")]
    public Dictionary<string, GridPoint>? SomaticState { get; set; }

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}
public class GridPoint
{
    //Normalized coordinates
    public int X { get; set; }
    public int Y { get; set; }

    //Arm, leg, etc
    public string? Label { get; set; }
}

[Table("community_qotd")]
public class QuestionOfTheDay
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("question")]
    [Required]
    public string Question { get; set; } = string.Empty;

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}

[Table("post")]
public class Post
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("answer")]
    [Required]
    public string Answer { get; set; } = string.Empty;

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("qotd_id")]
    public string? QotdId { get; set; }
    public QuestionOfTheDay? QuestionOfTheDay { get; set; }

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}