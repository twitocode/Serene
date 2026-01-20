using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NodaTime;

namespace Serene.Entities;

public enum QuestionSourceType
{
    AiGenerated,
    BankSelected,
    Manual,
}

public enum GenerationStatus
{
    Pending,
    Completed,
    Failed,
}

public enum ScheduleStatus
{
    Pending,
    InProgress,
    Completed,
    Failed,
}

[Table("question_bank")]
public class QuestionBank
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("question")]
    [Required]
    public string Question { get; set; } = string.Empty;

    [Column("category")]
    public string? Category { get; set; }

    [Column("is_ai_generated")]
    public bool IsAiGenerated { get; set; }

    [Column("created_at")]
    public Instant CreatedAt { get; set; } = SystemClock.Instance.GetCurrentInstant();

    [Column("used_count")]
    public int UsedCount { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;
}

[Table("question_generation_schedule")]
public class QuestionGenerationSchedule
{
    [Key]
    [Column("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Column("target_date")]
    public LocalDate TargetDate { get; set; }

    [Column("status")]
    public ScheduleStatus Status { get; set; }

    [Column("attempts")]
    public int Attempts { get; set; }

    [Column("last_attempt_at")]
    public Instant? LastAttemptAt { get; set; }

    [Column("error_details")]
    public string? ErrorDetails { get; set; }
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

    [Column("day")]
    public LocalDate Day { get; set; }

    [Column("source_type")]
    public QuestionSourceType SourceType { get; set; }

    [Column("source_id")]
    public string? SourceId { get; set; }

    [Column("backup_question_id")]
    public string? BackupQuestionId { get; set; }

    [Column("generation_status")]
    public GenerationStatus GenerationStatus { get; set; }

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
