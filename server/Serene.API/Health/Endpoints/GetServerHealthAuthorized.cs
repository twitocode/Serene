using Microsoft.AspNetCore.Http.HttpResults;
using Serene.API.Common;

namespace Serene.API.Health.Endpoints;

public class GetServerHealthAuthorized : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app
            .MapGet("/health-authorized", Handle)
            .WithSummary("Gets the health of the server (with authorization)")
            .RequireAuthorization();
    }

    private static Ok<string> Handle()
    {
        return TypedResults.Ok("The server is healthy");
    }
}