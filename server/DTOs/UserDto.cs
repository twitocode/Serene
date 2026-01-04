using NodaTime;

namespace Serene.DTOs;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? Image { get; set; }
    public bool EmailConfirmed { get; set; }
    public Instant CreatedAt { get; set; }
    public Instant UpdatedAt { get; set; }

    public PreferencesDto? Preferences { get; set; }
    public ProfileDto? Profile { get; set; }
}

public class PreferencesDto
{
    public string Id { get; set; } = string.Empty;
    public string? Theme { get; set; }
    public string? PasswordLock { get; set; }
    public string UserId { get; set; } = string.Empty;
    public Instant? CreatedAt { get; set; }
    public Instant? UpdatedAt { get; set; }
}
public class ProfileDto
{
    public string Id { get; set; } = string.Empty;
    public string? KoalaName { get; set; } = string.Empty;
    public string? KoalaColour { get; set; } = string.Empty;
    public string? KoalaPronouns { get; set; } = string.Empty;
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }

    public string UserId { get; set; } = string.Empty;
    public SchoolDto? School { get; set; }
}

public class SchoolDto
{
    public string Id { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string RegionCode { get; set; } = string.Empty;

    public string UserId { get; set; } = string.Empty;

}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = new();
}

public class CheckEmailResponseDto
{
    public bool Exists { get; set; }
    public bool HasPassword { get; set; }
    public List<string> Providers { get; set; } = new();
}
