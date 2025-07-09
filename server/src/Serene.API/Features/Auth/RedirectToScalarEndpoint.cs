using Serene.API.Common;

namespace Serene.API.Features.Auth;

public class RedirectToScalarEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/asdas", () => TypedResults.Redirect("/scalar"));
}