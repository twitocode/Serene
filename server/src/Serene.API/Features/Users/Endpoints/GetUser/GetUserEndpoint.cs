using Microsoft.AspNetCore.Identity;
using Serene.API.Common;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth;

namespace Serene.API.Features.Users.Endpoints.GetUser;

public class GetUserEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/users", async (HttpContext ctx, UserManager<User> userManager) =>
        {
            var id = ctx.User.GetUserId();
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user is null)
            {
                return Result<GetUserResponse>.Failure(404, new Error(AppErrors.UserNotFound, "User not found with provided token"));
            }
            return Result<GetUserResponse>.Success(user.ToGetUserResponse());
        })
        .RequireAuthorization()
            .WithTags(Tags.Users)
            .WithSummary("Gets the currently logged in user");
}
