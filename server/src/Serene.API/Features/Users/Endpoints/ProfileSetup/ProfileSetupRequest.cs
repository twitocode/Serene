namespace Serene.API.Features.Users.Endpoints.ProfileSetup;

public record ProfileSetupRequest(
    string FirstName,
    string LastName,
    string Username,
    string Country,
    string AvatarUrl,
    string Pronouns,
    string DateOfBirth,
    string Gender);
