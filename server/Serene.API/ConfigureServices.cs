using System.Reflection;
using System.Security.Claims;
using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Serene.API.Common;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Endpoints;
using Serene.API.Features.Auth.Services;
using Serene.API.Features.Health.Endpoints;
using Serene.API.Features.Mood.Endpoints;
using Serilog;

namespace Serene.API;

public static class ConfigureServices
{
    public static void AddServices(this WebApplicationBuilder builder)
    {
        builder.AddSerilog();
        builder.AddOpenApi();
        builder.AddDatabase();
        builder.AddValidators();
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddProblemDetails();
        builder.AddRateLimiting();
        builder.AddAppCors();
        builder.AddIdentityOptions();
        builder.AddAuthentication();
        builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());
    }

    private static IServiceCollection AddEndpoints(this IServiceCollection services, Assembly assembly)
    {
        var endpointServiceDescriptors = assembly.DefinedTypes
            .Where(type =>
                type is { IsAbstract: false, IsInterface: false } && typeof(IEndpoint).IsAssignableFrom(type))
            .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type)).ToArray();

        services.TryAddEnumerable(endpointServiceDescriptors);
        return services;
    }

    private static void AddOpenApi(this WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddOpenApi(options => { });
    }

    private static void AddValidators(this WebApplicationBuilder builder)
    {
        //test endpoints
        builder.Services.AddValidatorsFromAssemblyContaining<Register>();
        builder.Services.AddValidatorsFromAssemblyContaining<GetServerHealth>();
        builder.Services.AddValidatorsFromAssemblyContaining<GetLastMoodCheckin>();
    }

    private static void AddSerilog(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, configuration) =>
        {
            configuration.ReadFrom.Configuration(context.Configuration);
        });
    }

    private static void AddAppCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(o =>
        {
            o.AddPolicy("CorsPolicy",
                x => { x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000"); });
        });
    }

    private static void AddDatabase(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContextPool<AppDbContext>(opt =>
            opt.UseNpgsql(
                    builder.Configuration.GetConnectionString(MagicStrings.DatabaseConnectionStringName),
                    o => o
                        .SetPostgresVersion(15, 12)
                        .UseNodaTime()
                        .MapEnum<MoodType>("mood")
                        .MapEnum<ResourceType>("resource_type")
                        .MapEnum<Gender>("gender"))
                .UseSnakeCaseNamingConvention());
    }

    public static void AddRateLimiting(this WebApplicationBuilder builder)
    {
        builder.Services.AddRateLimiter(options =>
        {
            options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                RateLimitPartition.GetFixedWindowLimiter(
                    httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(),
                    partition => new FixedWindowRateLimiterOptions
                    {
                        AutoReplenishment = true,
                        PermitLimit = 10,
                        QueueLimit = 0,
                        Window = TimeSpan.FromMinutes(1)
                    }));
        });
    }

    private static void AddIdentityOptions(this WebApplicationBuilder builder)
    {
        builder.Services.AddIdentity<User, IdentityRole<Guid>>(o =>
        {
            o.Password.RequireDigit = true;
            o.Password.RequiredLength = 6;

            o.User.RequireUniqueEmail = true;
        }).AddEntityFrameworkStores<AppDbContext>().AddApiEndpoints();
    }

    private static void AddAuthentication(this WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            //Add cookie -> add Google -> add jwt VERY IMPORTANT
            .AddCookie()
            .AddGoogle(o =>
            {
                var clientId = builder.Configuration["Authentication:Google:ClientId"];
                var clientSecret = builder.Configuration["Authentication:Google:ClientId"];

                if (clientId == null) throw new ArgumentNullException(nameof(clientId));

                if (clientSecret == null) throw new ArgumentNullException(nameof(clientSecret));

                o.ClientId = clientId;
                o.ClientSecret = clientSecret;
                o.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = JwtService.SecurityKey(builder.Configuration["JwtOptions:Secret"]!),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = builder.Configuration["JwtOptions:Issuer"],
                    ValidAudiences = new List<string?>
                    {
                        builder.Configuration["JwtOptions:Audience"],
                        "https://localhost:7105"
                    }
                };


                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = async context =>
                    {
                        Log.Information("JWT Token received");
                        //the token to valid from the request's cookies
                        var accessToken = context.Request.Cookies["ACCESS_TOKEN"];
                        if (string.IsNullOrEmpty(accessToken))
                            Log.Error("Token was not provided through cookies for authorization");
                        context.Token = accessToken;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        Log.Error("JWT Token failed");

                        if (context.Exception.GetType() != typeof(SecurityTokenExpiredException))
                            return Task.CompletedTask;

                        Log.Error("JWT Token already expired");
                        context.Response.Headers.Append("Token-Expired", "true");

                        return Task.CompletedTask;
                    },
                    OnChallenge = async context =>
                    {
                        Log.Information("JWT Token Authentication Failed");
                        Log.Error("AuthenticateFailure type: {Type}, message: {Message}",
                            context.AuthenticateFailure?.GetType().FullName,
                            context.AuthenticateFailure?.Message);

                        context.HandleResponse();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";

                        // Ensure we always have an error and error description.
                        if (string.IsNullOrEmpty(context.Error))
                            context.Error = "JWT.InvalidToken";
                        if (string.IsNullOrEmpty(context.ErrorDescription))
                            context.ErrorDescription = "This request requires a valid JWT access token to be provided";
                    

                        switch (context.AuthenticateFailure)
                        {
                            case SecurityTokenExpiredException ex:
                                context.Response.Headers.Append("Token-Expired", "true");
                                context.Error = "JWT.TokenExpired";
                                context.ErrorDescription =
                                    $"The token expired on {ex.Expires:o}";
                                break;
                            case SecurityTokenInvalidAudienceException:
                                context.Error = "JWT.InvalidAudience";
                                context.ErrorDescription = "The token audience is invalid.";
                                break;
                            case SecurityTokenInvalidIssuerException:
                                context.Error = "JWT.InvalidIssuer";
                                context.ErrorDescription = "The token issuer is invalid.";
                                break;
                            case SecurityTokenNoExpirationException:
                                context.Error = "JWT.NoExpiration";
                                context.ErrorDescription = "The token does not have an expiration date.";
                                break;
                            case SecurityTokenInvalidSignatureException:
                                context.Error = "JWT.InvalidSignature";
                                context.ErrorDescription = "The token signature is invalid.";
                                break;
                            case SecurityTokenNotYetValidException ex:
                                context.Error = "JWT.NotYetValid";
                                context.ErrorDescription = $"The token is not valid before {ex.NotBefore:o}.";
                                break;
                            case SecurityTokenInvalidLifetimeException:
                                context.Error = "JWT.InvalidLifetime";
                                context.ErrorDescription = "The token lifetime is invalid.";
                                break;
                            case SecurityTokenMalformedException:
                                context.Error = "JWT.MalformedToken";
                                context.ErrorDescription = "The token is malformed";
                                break;
                            case ArgumentException:
                                context.Error = "JWT.ArgumentException";
                                context.ErrorDescription = "The token was not provided or is empty.";
                                break;
                            default:
                                context.Error = "JWT.UnknownError";
                                context.ErrorDescription = context.AuthenticateFailure?.Message ??  "An unknown error occurred during authentication.";
                                Log.Error("No authentication exception: likely no token was provided.");
                                break;
                        }

                        List<Error> errors = [new(context.Error, context.ErrorDescription)];
                        var problemDetailsService =
                            context.HttpContext.RequestServices.GetRequiredService<IProblemDetailsService>();
                        var instance = $"{context.HttpContext.Request.Method} => {context.HttpContext.Request.Path}";

                        await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
                        {
                            HttpContext = context.HttpContext,
                            ProblemDetails = new ProblemDetails
                            {
                                Status = StatusCodes.Status401Unauthorized,
                                Title = "JWT Authentication Error",
                                Detail = context.ErrorDescription ??
                                         "Something happened when trying to authenticate with the resource",
                                Instance = instance,
                                Extensions = new Dictionary<string, object?>
                                {
                                    { "errors", errors }
                                }
                            }
                        });
                    },
                    OnForbidden = async context =>
                    {
                        var instance = $"{context.HttpContext.Request.Method} => {context.HttpContext.Request.Path}";
                        Log.Error("User forbidden from {Instance}", instance);

                        List<Error> errors = [];

                        var problemDetailsService =
                            context.HttpContext.RequestServices.GetRequiredService<IProblemDetailsService>();

                        await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
                        {
                            HttpContext = context.HttpContext,
                            ProblemDetails = new ProblemDetails
                            {
                                Status = StatusCodes.Status403Forbidden,
                                Title = "JWT Forbidden Error",
                                Detail = "You are forbidden from accessing this resource.",
                                Instance = instance,
                                Extensions = new Dictionary<string, object?>
                                {
                                    { "errors", errors }
                                }
                            }
                        });
                    },
                    OnTokenValidated = async context =>
                    {
                        var claimsPrincipal = context.Principal;
                        var userId = claimsPrincipal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                        if (string.IsNullOrEmpty(userId))
                        {
                            Log.Warning("User ID could not be validated.");
                            return;
                        }

                        Log.Information("JWT Token successfully validated, UserId: {userId}", userId);
                    }
                };
            });


        builder.Services.AddAuthorization();

        builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("JwtOptions"));
        builder.Services.AddTransient<IJwtService, JwtService>();
    }
}