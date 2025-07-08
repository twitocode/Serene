namespace Serene.API.Features.Auth.Endpoints.Register;

public record RegisterRequest(
    string Email,
    string Password
);