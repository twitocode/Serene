using NodaTime;

namespace Serene.API.Data.Entities;

public enum MoodType
{
    Happy,
    Sad
}

public class MoodEntry : IEntity, IOwnedEntity
{
    public MoodType MoodType { get; set; }

    public Journal? Journal { get; set; }
    public Guid? JournalId { get; set; }

    public User User { get; set; }

    public Guid Id { get; set; }
    public Instant CreatedAt { get; set; }
    public Guid UserId { get; set; }
}