using NodaTime;

namespace Serene.API.Data.Entities;

public interface IOwnedEntity
{
    public Guid UserId { get; set; }
}

public interface IEntity
{
    public Guid Id { get; set; }
    public Instant CreatedAt { get; set; }
}