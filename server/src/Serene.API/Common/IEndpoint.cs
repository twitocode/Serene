namespace Serene.API.Common;

public interface IEndpoint
{
    RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app);
}