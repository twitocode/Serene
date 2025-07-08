using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Hybrid;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth;

namespace Serene.API.Features.Users.Endpoints.VerifyConfirmationEmail;

public class VerifyConfirmationEmail : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapPut("/users/confirmation-email", async ([FromBody] VerifyConfirmationEmailRequest verifyConfirmationEmailRequest, HttpContext httpContext,
                CancellationToken cancellationToken, HybridCache cache, IDistributedCache dCache,
                UserManager<User> userManager) =>
            {
                var result = await Handle(verifyConfirmationEmailRequest.Code, cache, dCache, userManager, httpContext, cancellationToken);
                return result.MapTypedResult(httpContext);
            })
            .WithTags(Tags.Users)
            .WithSummary("Verify Confirmation Code")
            .RequireAuthorization()
            .WithRequestValidation<VerifyConfirmationEmailRequest>();

    private async Task<Result<string>> Handle(string code, HybridCache cache, IDistributedCache dCache,
        UserManager<User> userManager, HttpContext context, CancellationToken cancellationToken)
    {
        var id = context.User.GetUserId();

        var bytes = await dCache.GetAsync(EmailCacheKey(id), cancellationToken);
        if (bytes is null)
            return Result<string>.InternalServerError(new Error("", "Code was never send to the user or expired"));
        var existingCode = Encoding.UTF8.GetString(bytes);

        if (existingCode != code)
            return Result<string>.BadRequest(new Error("", "Code sent does not match code required"));

        var user = await userManager.FindByIdAsync(id.ToString());
        if (user is null) return Result<string>.BadRequest(new Error("", "User was not found"));

        user.EmailConfirmed = true;
        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return Result<string>.InternalServerError(new Error("", "Failed to confirm user email"));

        await cache.RemoveAsync(EmailCacheKey(id), cancellationToken);
        return Result<string>.Success("Send Confirmation email");
    }

    private string EmailCacheKey(Guid id) => $"email-confirmation-code-{id}";



}