using System.Security.Claims;

namespace Serene.API.Features.Auth;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal claimsPrincipal)
    {
        // Log.Information("GetUserId:{id}", claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier));
        //for some reason it changes sub to nameidentifier???
        if (!Guid.TryParse(claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier), out var id))
            throw new InvalidOperationException("Invalid UserId");

        return id;
    }

    public static string GetUserEmail(this ClaimsPrincipal claimsPrincipal)
    {
        var email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);
        if (email is null)
            throw new InvalidOperationException("Email not provided from token");

        return email;
    }
    
    public static bool GetIsSetupCompleted(this ClaimsPrincipal claimsPrincipal)
    {
        var pc = claimsPrincipal.FindFirstValue("profile-completed");
        if (pc is null || !bool.TryParse(pc, out var completed))
            throw new InvalidOperationException("Profile completed is not provided from token");

        return completed;
    }
}