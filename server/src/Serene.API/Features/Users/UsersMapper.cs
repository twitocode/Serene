using System.Globalization;
using Serene.API.Data.Entities;
using Serene.API.Features.Users.Endpoints.GetExistingProfileData;
using Serene.API.Features.Users.Endpoints.GetUser;

namespace Serene.API.Features.Users;

public static class UsersMapper
{
    public static GetExistingProfileDataResponse ToGetExistingProfileData(this User user) =>
        new(user.FirstName, user.LastName, user.Country, user.AvatarUrl, user.Pronouns, user.Gender.ToString(),
            user.DateOfBirth.ToString("yyyy-MM-dd", //2007-04-21
                CultureInfo.InvariantCulture), user.IsSetupCompleted);

    public static GetUserResponse ToGetUserResponse(this User user) =>
        new(user.FirstName, user.LastName, user.Country, user.AvatarUrl, user.Pronouns, user.Gender.ToString(),
            user.DateOfBirth.ToString("yyyy-MM-dd", //2007-04-21
                CultureInfo.InvariantCulture), user.IsSetupCompleted);
}