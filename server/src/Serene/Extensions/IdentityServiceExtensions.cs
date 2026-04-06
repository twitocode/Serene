using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Serene.Configuration;

namespace Serene.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment environment
    )
    {
        var jwtOptions = config.GetSection(JwtOptions.SectionName).Get<JwtOptions>();
        var googleOptions = config.GetSection(GoogleOptions.SectionName).Get<GoogleOptions>();

        if (jwtOptions == null)
            throw new Exception("JWT Configuration missing");
        if (googleOptions == null)
            throw new Exception("Google Configuration missing");

        var isDev = environment.IsDevelopment();
        var externalSameSite = isDev ? SameSiteMode.Lax : SameSiteMode.None;
        var externalSecure = isDev ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;

        services
            .AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddCookie(
                "ExternalCookie",
                o =>
                {
                    o.Cookie.Name = ".Serene.External";
                    o.Cookie.Path = "/";
                    o.Cookie.SameSite = externalSameSite;
                    o.Cookie.SecurePolicy = externalSecure;
                    o.Cookie.HttpOnly = true;
                }
            )
            .AddJwtBearer(options =>
            {
                options.Authority = jwtOptions.Authority;
                options.Audience = jwtOptions.Audience;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtOptions.Authority,
                    ValidAudience = jwtOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtOptions.Key
                                ?? throw new ArgumentException("Missing Jwt Key in configuration")
                        )
                    ),
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        if (context.Request.Cookies.ContainsKey("session_token"))
                        {
                            context.Token = context.Request.Cookies["session_token"];
                        }
                        return Task.CompletedTask;
                    },
                };
            })
            .AddGoogle(o =>
            {
                o.ClientId =
                    googleOptions.ClientId ?? throw new ArgumentException("Missing Client ID");
                o.ClientSecret =
                    googleOptions.ClientSecret
                    ?? throw new ArgumentException("Missing Client Secret");
                o.Scope.Add("profile");
                o.SignInScheme = "ExternalCookie";
                o.CorrelationCookie.Name = ".Serene.Correlation";
                o.CorrelationCookie.Path = "/";
                o.CorrelationCookie.SameSite = externalSameSite;
                o.CorrelationCookie.SecurePolicy = externalSecure;
                o.CallbackPath = "/signin-google";
            });

        return services;
    }
}
