using NodaTime;

namespace Serene.Features.Users;

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? Image { get; set; }
    public bool EmailConfirmed { get; set; }
    public string? Gender { get; set; }
    public List<string> Roles { get; set; } = new();
    public Instant CreatedAt { get; set; }
    public Instant UpdatedAt { get; set; }

    public SettingsResponse? Settings { get; set; }
    public ProfileResponse? Profile { get; set; }
}

public class CheckEmailResponse
{
    public bool Exists { get; set; }
    public bool HasPassword { get; set; }
    public List<string> Providers { get; set; } = new();
}
