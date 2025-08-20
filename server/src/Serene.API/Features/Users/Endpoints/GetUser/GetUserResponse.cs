
namespace Serene.API.Features.Users.Endpoints.GetUser;

public record GetUserResponse(
    string FirstName,
    string LastName,
    string Country,
    string AvatarUrl,
    string Pronouns,
    string Gender,
    string DateOfBirth, //YYYY-MM-DD format
    bool IsSetupCompleted
);