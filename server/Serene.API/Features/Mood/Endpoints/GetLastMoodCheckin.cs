using Serene.API.Common;
using Serene.API.Common.Results;

namespace Serene.API.Features.Mood.Endpoints;

public class GetLastMoodCheckin(ILogger<GetLastMoodCheckin> logger) : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/moods/checkin", async (HttpContext context) =>
            {
                var result = await Handle(context);
                return result.MapTypedResult(context);
            })
            .WithTags(Tags.Mood)
            .RequireAuthorization()
            .WithSummary("Determine if there should be another mood checkin");

    private async Task<Result<bool>> Handle(HttpContext context)
    {
        foreach (var userClaim in context.User.Claims) logger.LogInformation("Found claim: {Claim}", userClaim);
        return Result<bool>.Success(true);
    }
}