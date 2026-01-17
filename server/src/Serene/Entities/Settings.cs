
using NodaTime;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Serene.Entities;

public enum Theme
{
    Dark,
    Light,
    System
}



[Table("preferences")]
public class Settings
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