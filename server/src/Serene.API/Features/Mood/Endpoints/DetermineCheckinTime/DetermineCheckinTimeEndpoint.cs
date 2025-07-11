using Microsoft.AspNetCore.Identity;
using NodaTime;
using NodaTime.Extensions;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Mood.Endpoints.DetermineCheckinTime;

public class DetermineCheckinTimeEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/mood/check-in",
                (HttpContext ctx, UserManager<User> userManager) => Handle(ctx, userManager).MapTypedResult(ctx))
            .WithSummary("Determine whether you have a mood checkin available")
            .WithTags(Tags.Mood)
            .RequireAuthorization()
            .WithEnsureUserExists();

    public Result<bool> Handle(HttpContext ctx, UserManager<User> userManager)
    {
        var user = ctx.GetUser();
        var clock = SystemClock.Instance;
        var now = clock.InUtc().GetCurrentDate();
        
        return Result<bool>.Success(now.Day > user.LastMoodCheckin.Day);
    }
}