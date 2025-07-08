using Serene.API.Common;
using Serene.API.Common.Results;
using Serene.API.Data;

namespace Serene.API.Features.Users.Endpoints.GetAllCountries;

public class GetAllCountriesEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/users/countries", () => Result<string[]>.Success(DefaultData.Countries))
            .WithTags(Tags.Users)
            .WithSummary("Gets a list of all countries in the world");
}
