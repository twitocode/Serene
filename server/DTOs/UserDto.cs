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
    
    // public ProfileDto? Profile { get; set; }
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
