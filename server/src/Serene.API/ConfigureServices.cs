using System.Reflection;
using System.Security.Claims;
using System.Text;
using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Resend;
using Serene.API.Common;
using Serene.API.Common.Results;
using Serene.API.Common.Services;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Endpoints.Login;
using Serene.API.Features.Auth.Endpoints.Register;
using Serene.API.Features.Auth.Services;
using Serene.API.Features.Health.Endpoints;
using Serene.API.Features.Mood.Endpoints.DetermineCheckinTime;
using Serene.API.Features.Mood.Endpoints.SubmitMoodEntry;
using Serene.API.Features.Users.Endpoints.VerifyConfirmationEmail;
using Serilog;

namespace Serene.API;

public static class ConfigureServices
{
    public static void AddServices(this WebApplicationBuilder builder)
    {
        builder.Logging();
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
        builder.AddHybridCache();
        builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());
        builder.AddEmailService();
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

    private static void AddEmailService(this WebApplicationBuilder builder)
    {
        builder.Services.AddOptions();
        builder.Services.AddHttpClient<ResendClient>();
        builder.Services.Configure<ResendClientOptions>(o =>
        {
            o.ApiToken = builder.Configuration["Resend:ApiToken"] ??
                         throw new ArgumentNullException("Resend:ApiToken");
        });

        builder.Services.AddScoped<IResend>(sp =>
        {
            var options = sp.GetRequiredService<IOptionsSnapshot<ResendClientOptions>>();
            var httpClientFactory = sp.GetRequiredService<IHttpClientFactory>();
            return new ResendClient(options, httpClientFactory.CreateClient());
        });

        builder.Services.AddScoped<IEmailService, ResendEmailService>();
    }

    private static void AddHybridCache(this WebApplicationBuilder builder)
    {
        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = builder.Configuration.GetConnectionString("Redis");
        });


        builder.Services.AddHybridCache(options =>
        {
            // Maximum size of cached items
            options.MaximumPayloadBytes = 1024 * 1024 * 10; // 10MB
            options.MaximumKeyLength = 512;

            // Default timeouts
            options.DefaultEntryOptions = new HybridCacheEntryOptions
            {
                Expiration = TimeSpan.FromMinutes(30),
                LocalCacheExpiration = TimeSpan.FromMinutes(30)
            };
        });
    }

    private static void AddValidators(this WebApplicationBuilder builder)
    {
        //test endpoints
        builder.Services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
        builder.Services.AddValidatorsFromAssemblyContaining<SubmitMoodEntryValidator>();
    }

    private static void Logging(this WebApplicationBuilder builder)
    {
        Log.Logger = new LoggerConfiguration()
            .Enrich.FromLogContext()
            .ReadFrom.Configuration(builder.Configuration)
            .WriteTo.Console()
            // .WriteTo.OpenTelemetry(x =>
            // {
            //     //TODO: set this up later
            //     x.Endpoint = new Uri(builder.Configuration["Logging:Seq:Endpoint"] ?? throw new ArgumentNullException("Logging:Seq:Endpoint")).ToString();
            //     x.Protocol = OtlpProtocol.HttpProtobuf;
            //     x.Headers = new Dictionary<string, string>()
            //     {
            //         {
            //             "X-Seq-ApiKey",
            //             builder.Configuration["Logging:Seq:ApiKey"] ??
            //             throw new ArgumentNullException("Loggin:Seq:ApiKey")
            //         }
            //     };
            // })
            .CreateBootstrapLogger();

        builder.Services.AddSerilog((services, lc) => lc
            .ReadFrom.Configuration(builder.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .WriteTo.Console());
    }

    private static void AddAppCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(o =>
        {
            o.AddPolicy("CorsPolicy",
                x => { x.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000", "https://localhost:3000"); });
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
                        .MapEnum<Gender>("gender")
                        .MapEnum<EnergyLevelType>("energy_level"))

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
            //TODO: should throw an error but is not???
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
                // o.DefaultSignInScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultSignInScheme =
                    IdentityConstants.ExternalScheme; // Use Identity's external scheme for external logins
            })
            //Add cookie -> add Google -> add jwt VERY IMPORTANT
            // .AddCookie()
            .AddGoogle(o =>
            {
                var clientId = builder.Configuration["Authentication:Google:ClientId"];
                var clientSecret = builder.Configuration["Authentication:Google:ClientSecret"];

                if (clientId == null) throw new ArgumentNullException(nameof(clientId));
                if (clientSecret == null) throw new ArgumentNullException(nameof(clientSecret));

                o.ClientId = clientId;
                o.ClientSecret = clientSecret;
                // o.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                o.SignInScheme = IdentityConstants.ExternalScheme;

                // IMPORTANT: Add the scopes to request additional profile information
                o.Scope.Add("profile"); // This implicitly includes userinfo.profile and picture
                o.Scope.Add("https://www.googleapis.com/auth/user.gender.read");
                o.Scope.Add("https://www.googleapis.com/auth/user.addresses.read"); // For country claim

                // Map Google claims to your application's claims if needed (optional here,
                // as we're directly using the values to populate User properties)
                o.ClaimActions.MapJsonKey(ClaimTypes.Gender, "gender");
                o.ClaimActions.MapJsonKey(ClaimTypes.Country,
                    "country"); // Google may not provide this directly, 'locale' is more common for initial country code
                o.ClaimActions.MapJsonKey("picture", "picture"); // Map the profile picture URL
                o.ClaimActions.MapJsonKey(ClaimTypes.GivenName, "given_name");
                o.ClaimActions.MapJsonKey(ClaimTypes.Surname, "family_name");
                o.ClaimActions.MapJsonKey("locale", "locale"); // To get locale which can infer country
            })
            .AddJwtBearer(options =>
            {
                var issuers = builder.Configuration.GetSection("JwtOptions:Issuers").Get<string[]>();
                var audiences = builder.Configuration.GetSection("JwtOptions:Audiences").Get<string[]>();

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["JwtOptions:Secret"]!)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuers = issuers,
                    ValidAudiences = audiences
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = async context =>
                    {
                        Log.Information("JWT Authentication Request Received");
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
                                context.ErrorDescription = context.AuthenticateFailure?.Message ??
                                                           "An unknown error occurred during authentication.";
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