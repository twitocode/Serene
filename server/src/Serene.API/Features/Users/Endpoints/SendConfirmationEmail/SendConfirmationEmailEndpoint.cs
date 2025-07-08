using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Hybrid;
using Serene.API.Common;
using Serene.API.Common.Results;
using Serene.API.Common.Services;
using Serene.API.Features.Auth;

namespace Serene.API.Features.Users.Endpoints.SendConfirmationEmail;

public class SendConfirmationEmailEndpoint : IEndpoint
{
    private readonly Random _generator = new();

    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/users/confirmation-email", async (HttpContext httpContext, IEmailService emailService,
                HybridCache cache, IDistributedCache dCache, CancellationToken cancellationToken) =>
            {
                var result = await Handle(emailService, cache, dCache, httpContext, cancellationToken);
                return result.MapTypedResult(httpContext);
            })
            .WithTags(Tags.Users)
            .WithSummary("Send Confirmation Code")
            .RequireAuthorization();

    private async Task<Result<string>> Handle(IEmailService emailService, HybridCache cache, IDistributedCache dCache,
        HttpContext context, CancellationToken cancellationToken)
    {
        var email = context.User.GetUserEmail();
        var id = context.User.GetUserId();

        var code = GenerateCode();

        var existingCode = await dCache.GetAsync(EmailCacheKey(id), cancellationToken);
        if (existingCode is not null) return Result<string>.BadRequest(new Error("", "Code already sent out to user"));

        var options = new HybridCacheEntryOptions
        {
            Expiration = TimeSpan.FromDays(30), //expires in a month to prevent the same user from sending another email
            LocalCacheExpiration = TimeSpan.FromMinutes(30)
        };

        await cache.SetAsync(
            EmailCacheKey(id),
            code,
            options, cancellationToken: cancellationToken);

        if (!await emailService.SendConfirmationEmail(email, code, cancellationToken))
            return Result<string>.InternalServerError(new Error("", "Could not send email to user"));

        return Result<string>.Success("Send Confirmation email");
    }

    private string GenerateCode() => _generator.Next(0, 1000000).ToString("D6");
    private string EmailCacheKey(Guid id) => $"email-confirmation-code-{id}";
}