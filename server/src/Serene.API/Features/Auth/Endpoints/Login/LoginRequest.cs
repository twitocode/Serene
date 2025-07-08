namespace Serene.API.Features.Auth.Endpoints.Login;

public record LoginRequest
{
    // Parameterless constructor for dynamic instantiation
    public LoginRequest()
    {
    }

    // Additional constructor remains available for manual initialization
    public LoginRequest(string email, string password) : this()
    {
        Email = email;
        Password = password;
    }

    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}