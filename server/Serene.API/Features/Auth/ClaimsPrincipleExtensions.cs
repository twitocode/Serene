using System.Security.Claims;

namespace Serene.API.Features.Auth;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal claimsPrincipal)
    {
        if (!Guid.TryParse(claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier), out var id))
            throw new InvalidOperationException("Invalid UserId");

        return id;
    }
}