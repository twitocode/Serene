using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;

namespace Serene.Entities;

[Table("user_interests")]
public class UserInterest
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("interest")]
    [Required]
    [MaxLength(100)]
    public string Interest { get; set; } = string.Empty;

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}

[Table("peer_matches")]
public class PeerMatch
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    [Column("matched_user_id")]
    public string MatchedUserId { get; set; } = string.Empty;
    public User MatchedUser { get; set; } = null!;

    [Column("shared_interest")]
    [MaxLength(100)]
    public string SharedInterest { get; set; } = string.Empty;

    [Column("match_date")]
    public LocalDate MatchDate { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();
}
