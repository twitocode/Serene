using Serene.Configuration;

namespace Serene.Extensions;

public static class ConfigurationExtensions
{
    public static IServiceCollection AddConfigurationBindings(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.Configure<JwtOptions>(config.GetSection(JwtOptions.SectionName));
        services.Configure<GoogleOptions>(config.GetSection(GoogleOptions.SectionName));
        services.Configure<CorsOptions>(config.GetSection(CorsOptions.SectionName));

        services.Configure<AIOptions>(options =>
        {
            options.GeminiApiKey = config["GEMINI_API_KEY"] ?? string.Empty;
            options.OpenRouterApiKey = config["OPENROUTER_API_KEY"] ?? string.Empty;
        });

        return services;
    }
}
