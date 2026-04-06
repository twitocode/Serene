using Microsoft.AspNetCore.Http;

namespace Serene.Middleware;

/// <summary>
/// When the API is reached via a Next.js rewrite, Kestrel sees the API host (e.g. localhost:5025),
/// but OAuth redirect_uri and callback URLs must use the browser-facing origin (e.g. localhost:3000).
/// Set <c>PublicApplicationUrl</c> (or <c>FRONTEND_URL</c> / <c>NEXT_PUBLIC_SITE_URL</c> on the API host)
/// to that origin so Google sign-in and session cookies work through the proxy.
/// Also clears <see cref="HttpRequest.PathBase"/> so OAuth does not build <c>/auth/signin-google</c>
/// (PathBase + CallbackPath) when this API is not actually mounted under <c>/auth</c> as a path base.
/// </summary>
public sealed class PublicApplicationUrlMiddleware(
    RequestDelegate next,
    IConfiguration configuration
)
{
    private readonly Uri? _publicBase = ResolvePublicBase(configuration);

    public Task Invoke(HttpContext context)
    {
        if (_publicBase != null)
        {
            context.Request.Scheme = _publicBase.Scheme;
            context.Request.Host = _publicBase.IsDefaultPort
                ? new HostString(_publicBase.Host)
                : new HostString(_publicBase.Host, _publicBase.Port);
            context.Request.PathBase = PathString.Empty;
        }

        return next(context);
    }

    /// <summary>First non-empty config value wins (same keys as middleware).</summary>
    public static string? GetConfiguredPublicUrl(IConfiguration configuration)
    {
        return FirstNonEmpty(
            configuration["PublicApplicationUrl"],
            configuration["FRONTEND_URL"],
            configuration["NEXT_PUBLIC_SITE_URL"]
        );
    }

    private static Uri? ResolvePublicBase(IConfiguration configuration) =>
        ParsePublicUrl(GetConfiguredPublicUrl(configuration));

    private static string? FirstNonEmpty(params string?[] values)
    {
        foreach (var v in values)
        {
            if (!string.IsNullOrWhiteSpace(v))
                return v.Trim();
        }

        return null;
    }

    private static Uri? ParsePublicUrl(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        if (!Uri.TryCreate(value.TrimEnd('/'), UriKind.Absolute, out var uri))
            return null;

        return uri;
    }
}
