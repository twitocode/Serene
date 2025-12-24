using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serene.API.Common;
using Serene.API.Data;
using Serilog;

namespace Serene.API;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        app.UseSerilogRequestLogging();
        app.UseCors("CorsPolicy");

        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
            KnownNetworks = { },
            KnownProxies = { }
        });
        app.UseHttpsRedirection();
        app.UseAuthentication();

        app.UseAuthorization();
        app.UseMiddleware();
        app.UseExceptionHandler();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseScalar();
            app.UseDeveloperExceptionPage();
        }

        var versionedGroup = app.MapGroup("v1");

        app.MapEndpoints(versionedGroup);

        await app.EnsureDatabaseCreatedAspire();
    }
    private static void UseScalar(this WebApplication app)
    {
        app.MapScalarApiReference(options => { });
    }

    private static void UseMiddleware(this WebApplication app)
    {
        //app.UseMiddleware<ExceptionHandlingMiddleware>();
    }

    private static WebApplication MapEndpoints(this WebApplication app, RouteGroupBuilder? routeGroupBuilder)
    {
        var endpoints = app.Services.GetRequiredService<IEnumerable<IEndpoint>>();
        IEndpointRouteBuilder builder = routeGroupBuilder is null ? app : routeGroupBuilder;

        foreach (var endpoint in endpoints)
            endpoint.MapEndpoint(builder)
                .WithOpenApi();

        return app;
    }

    private static async Task EnsureDatabaseCreatedAspire(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // DEBUG: Log the connection string being used
        var connectionString = db.Database.GetConnectionString();
        Log.Information("Using connection string: {ConnectionString}", connectionString);

        // Retry logic for Aspire - database might not be ready immediately
        var maxRetries = 10;
        var delay = TimeSpan.FromSeconds(2);

        for (int i = 0; i < maxRetries; i++)
        {
            try
            {
                Log.Information("Attempting to connect to database (attempt {Attempt}/{MaxRetries})", i + 1, maxRetries);
                await db.Database.MigrateAsync();
                Log.Information("Database migration completed successfully");
                return;
            }
            catch (Exception ex) when (i < maxRetries - 1)
            {
                Log.Warning(ex, "Failed to connect to database. Retrying in {Delay} seconds...", delay.TotalSeconds);
                await Task.Delay(delay);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Failed to connect to database after {MaxRetries} attempts", maxRetries);
                throw;
            }
        }
}
}