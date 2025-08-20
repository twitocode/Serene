namespace Serene.API.Features.Users.Endpoints.GetExisitingProfileData;

public record GetExistingProfileDataResponse(
     string FirstName,
     string LastName,

     string Country,
     string AvatarUrl,
     string Pronouns,
     string Gender,

     string DateOfBirth //YYYY-MM-DD format
);
