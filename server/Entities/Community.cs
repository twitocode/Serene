using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;

namespace Serene.Entities;


[Table("community_qotd")]
public class QuestionOfTheDay
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("question")]
    [Required]
    public string Question { get; set; } = string.Empty;

    [Column("day")]
    public LocalDate Day { get; set; } 

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("updated_at")]
    public Instant UpdatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("posts")]
    public ICollection<Post> Responses { get; set; } = new List<Post>();
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