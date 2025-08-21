using Microsoft.AspNetCore.Identity;
using Serene.API.Common;
using Serene.API.Common.Mappers;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth;
using Serene.API.Features.Users.Endpoints.GetExistingProfileData;

namespace Serene.API.Features.Users.Endpoints.GetExistingProfileData;

public class GetExistingProfileDataEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/users/setup", async (HttpContext context, UserManager<User> userManager, CancellationToken token) =>
            {
                var result = await Handle(userManager, context, token);
                return result.MapTypedResult(context);
            })
            .WithSummary("Get the incomplete profile")
            .WithTags(Tags.Users);

    private async Task<Result<GetExistingProfileDataResponse>> Handle(UserManager<User> userManager, HttpContext context, CancellationToken token)
    {
        var id = context.User.GetUserId();
        var user = await userManager.FindByIdAsync(id.ToString());

        if (user is null)
            return Result<GetExistingProfileDataResponse>.BadRequest(new Error(AppErrors.UserNotFound, "Could not find user by id"));
        if (user.IsSetupCompleted)
            return Result<GetExistingProfileDataResponse>.Unauthorized(new Error(AppErrors.UserUpdateError, "User has already been setup"))
                ;
        return Result<GetExistingProfileDataResponse>.Success(user.ToGetExistingProfileData());
    }
}
