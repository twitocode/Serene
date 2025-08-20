namespace Serene.API.Features.Users.Endpoints.GetExistingProfileData;

public record GetExistingProfileDataResponse(
    string FirstName,
    string LastName,
    string Country,
    string AvatarUrl,
    string Pronouns,
    string Gender,
    string DateOfBirth, //YYYY-MM-DD format
    bool IsSetupCompleted
);