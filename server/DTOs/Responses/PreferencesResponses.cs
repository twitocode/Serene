using NodaTime;

namespace Serene.DTOs;

public class PreferencesResponse
{
    public string Id { get; set; } = string.Empty;
    public string? Theme { get; set; }
    public string? PasswordLock { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Instant? CreatedAt { get; set; }
    public Instant? UpdatedAt { get; set; }
}