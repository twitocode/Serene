using Microsoft.EntityFrameworkCore;
using Npgsql;
using Serene.Data;

namespace Serene.Extensions;

public static class DatabaseServiceExtensions
{
    public static IServiceCollection AddDatabaseServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        var connectionString =
            config.GetConnectionString("Postgres")
            ?? throw new ArgumentException("Postgres DB string not provided");

        var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.EnableDynamicJson();
        dataSourceBuilder.UseNodaTime();
        dataSourceBuilder.UseVector();
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(
                dataSource,
                o =>
                {
                    o.UseNodaTime();
                    o.UseVector();
                }
            )
        );

        var redisConnectionString = config.GetConnectionString("Redis");
        if (!string.IsNullOrEmpty(redisConnectionString))
        {
            services.AddStackExchangeRedisCache(o =>
            {
                o.Configuration = redisConnectionString;
            });
        }
        else
        {
            services.AddDistributedMemoryCache();
        }

        return services;
    }
}
