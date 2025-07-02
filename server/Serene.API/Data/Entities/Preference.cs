using NodaTime;

namespace Serene.API.Data.Entities;

public enum Theme
{
    Light,
    Dark
}

public class Preference : IOwnedEntity
{
    public Theme Theme { get; set; } = Theme.Dark;
    public string? PageLock { get; set; }
    public User User { get; set; }
    public Instant CreatedAt { get; set; }

    public Guid UserId { get; set; }
}