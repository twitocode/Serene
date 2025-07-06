using System.Reflection;
using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Serene.API.Common;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Endpoints;
using Serene.API.Features.Auth.Services;
using Serene.API.Features.Health.Endpoints;
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
        builder.AddAuthentication();
        builder.AddIdentityOptions();
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
                    ValidAudience = builder.Configuration["JwtOptions:Audience"]
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        //the token to valid from the request's cookies
                        context.Token = context.Request.Cookies["ACCESS_TOKEN"];
                        return Task.CompletedTask;
                    }
                };
            });


        builder.Services.AddAuthorization();

        builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("JwtOptions"));
        builder.Services.AddTransient<IJwtService, JwtService>();
    }
}