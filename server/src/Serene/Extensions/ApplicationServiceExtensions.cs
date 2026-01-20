using System.ClientModel;
using Google.GenAI;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Caching.Hybrid;
using OpenAI;
using OpenAI.Chat;
using Quartz;
using Quartz.AspNetCore;
using Serene.Configuration;
using Serene.Data;
using Serene.Entities;
using Serene.Jobs;

namespace Serene.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        var aiOptions = new AIOptions
        {
            GeminiApiKey = config["GEMINI_API_KEY"] ?? string.Empty,
            OpenRouterApiKey = config["OPENROUTER_API_KEY"] ?? string.Empty,
        };
        var corsOptions = config.GetSection(CorsOptions.SectionName).Get<CorsOptions>();

        services.AddHybridCache(o =>
        {
            o.DefaultEntryOptions = new HybridCacheEntryOptions
            {
                Expiration = TimeSpan.FromSeconds(10),
                LocalCacheExpiration = TimeSpan.FromSeconds(5),
            };
        });

        services
            .AddIdentityCore<User>(options =>
            {
                options.User.RequireUniqueEmail = true;
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<TokenService>();
        services.AddScoped<IOnboardingService, OnboardingService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<ISettingsService, SettingsService>();
        services.AddScoped<ICommunityService, CommunityService>();
        services.AddScoped<ICheckinService, CheckinService>();
        services.AddScoped<IEmbeddingService, EmbeddingService>();
        services.AddScoped<IExploreService, ExploreService>();
        services.AddScoped<IAIService, OpenAIService>();

        services.AddScoped(x => new Client(
            apiKey: !string.IsNullOrEmpty(aiOptions.GeminiApiKey)
                ? aiOptions.GeminiApiKey
                : throw new ArgumentException("Gemini API key not found in environment")
        ));

        services.AddScoped(x => new ChatClient(
            credential: new ApiKeyCredential(
                !string.IsNullOrEmpty(aiOptions.OpenRouterApiKey)
                    ? aiOptions.OpenRouterApiKey
                    : throw new ArgumentException("OpenRouter API key not found in environment")
            ),
            model: "openai/gpt-oss-20b",
            options: new OpenAIClientOptions { Endpoint = new Uri("https://openrouter.ai/api/v1") }
        ));

        // Quartz
        services.AddQuartz(options =>
        {
            var jobKey = new JobKey("SendQOTDJob");
            options.AddJob<SendQOTDJob>(opts => opts.WithIdentity(jobKey));

            options.AddTrigger(opts =>
                opts.ForJob(jobKey)
                    .WithIdentity("SendQOTDJob-trigger")
                    .WithCronSchedule("0 0 0 * * ?") // Run at midnight every day
            );
        });

        services.AddQuartzServer(options =>
        {
            options.WaitForJobsToComplete = true;
        });

        services.AddHostedService<QOTDStartupService>();

        var allowedOriginsEnv = config["AllowedOrigins"];
        string[]? origins = null;

        if (!string.IsNullOrEmpty(allowedOriginsEnv))
        {
            // Support comma or semicolon separated list from Env Var
            origins = allowedOriginsEnv
                .Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .ToArray();
        }
        else
        {
            var corsSection = config.GetSection(CorsOptions.SectionName).Get<CorsOptions>();
            if (corsSection?.Origins != null && corsSection.Origins.Length > 0)
            {
                origins = corsSection.Origins;
            }
        }

        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                if (origins == null || origins.Length == 0)
                    throw new ArgumentException(
                        "Missing CORS Origins. Set 'AllowedOrigins' env var or 'Cors:Origins' in appsettings."
                    );

                policy.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
            });
        });

        return services;
    }
}
