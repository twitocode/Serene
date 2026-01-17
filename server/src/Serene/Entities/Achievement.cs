
using NodaTime;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Serene.Entities;

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