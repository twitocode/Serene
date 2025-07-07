using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.API.Common;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Auth.Endpoints;

/// <summary>
///     Called from the client
/// </summary>
public class GetGoogleLogin : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) => app.MapGet("/auth/login/google", Handle)
        .WithSummary("Logs in a user with Google").WithTags(Tags.Auth);

    private ChallengeHttpResult Handle([FromQuery] string returnUrl, HttpContext context, LinkGenerator linkGenerator,
        SignInManager<User> signInManager)
    {
        var properties = signInManager.ConfigureExternalAuthenticationProperties("Google",
            linkGenerator.GetPathByName(context, "GoogleLoginCallback") + $"?returnUrl={returnUrl}");

        return TypedResults.Challenge(properties, ["Google"]);
    }
}