using Serene.API.Common;
using Serene.API.Common.Results;

namespace Serene.API.Features.Health.Endpoints;

public class ServerHealthEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app)
    {
        return app
            .MapGet("/health", () => TypedResults.Ok(Handle()))
            .WithSummary("Gets the health of the server")
            .WithTags(Tags.Health);
    }

    private static Result<string> Handle()
    {
        return Result<string>.Success("Healthy server 🎂😊");
    }
}