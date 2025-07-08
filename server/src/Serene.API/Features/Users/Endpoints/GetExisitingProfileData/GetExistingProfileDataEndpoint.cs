using Microsoft.AspNetCore.Identity;
using Serene.API.Common;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth;

namespace Serene.API.Features.Users.Endpoints.GetExisitingProfileData;

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

    private async Task<Result<User>> Handle(UserManager<User> userManager, HttpContext context, CancellationToken token)
    {
        var id = context.User.GetUserId();
        var user = await userManager.FindByIdAsync(id.ToString());

        if (user is null)
            return Result<User>.BadRequest(new Error("", "Could not find user by id"));
        if (user.IsSetupCompleted)
            return Result<User>.Unauthorized(new Error("", "User has already been setup"))
                ;
        return Result<User>.Success(user);
    }
}
