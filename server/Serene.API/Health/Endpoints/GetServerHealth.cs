using Microsoft.AspNetCore.Http.HttpResults;
using Serene.API.Common;

namespace Serene.API.Health.Endpoints;

public class GetServerHealth : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app
            .MapGet("/health", Handle)
            .WithSummary("Gets the health of the server");
    }
    
    private static Ok<string> Handle()
    {
        return TypedResults.Ok("The server is healthy");
    }
}
