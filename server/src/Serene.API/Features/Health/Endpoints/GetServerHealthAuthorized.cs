using Serene.API.Common;
using Serene.API.Common.Results;

namespace Serene.API.Features.Health.Endpoints;

public class GetServerHealthAuthorized : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app)
    {
        return app
            .MapGet("/health-authorized", () => TypedResults.Ok(Handle()))
            .WithSummary("Gets the health of the server (with authorization)")
            .RequireAuthorization()
            .WithTags(Tags.Health);
    }

    public static void Map(IEndpointRouteBuilder app)
    {
    }

    private static Result<string> Handle()
    {
        return Result<string>.Success("Healthy authorization server 🎂😊");
    }
}