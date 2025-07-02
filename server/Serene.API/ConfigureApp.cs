using Microsoft.EntityFrameworkCore;
using Serene.API.Data;
using Serilog;

namespace Serene.API;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        app.UseSerilogRequestLogging();
        app.MapOpenApi();
        app.UseHttpsRedirection();
        app.MapApiEndpoints();
        await app.EnsureDatabaseCreated();
    }

    private static async Task EnsureDatabaseCreated(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
    }
}