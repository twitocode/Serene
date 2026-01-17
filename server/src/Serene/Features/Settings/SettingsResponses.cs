using NodaTime;

namespace Serene.Features.UserSettings;

public class SettingsResponse
{
    public string Id { get; set; } = string.Empty;
    public string? Theme { get; set; }
    public string? PasswordLock { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Instant? CreatedAt { get; set; }
    public Instant? UpdatedAt { get; set; }
}

public class UpdateSettingsDto
{
    public string? Theme { get; set; }
    public string? PasswordLock { get; set; }
}