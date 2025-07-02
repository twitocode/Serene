using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serene.API.Data;
using Serilog;

namespace Serene.API;

public static class ConfigureApp
{
    public static async Task Configure(this WebApplication app)
    {
        app.UseSerilogRequestLogging();


        app.UseExceptionHandler(_ => { });
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();
        app.MapApiEndpoints();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.UseScalar();
        }

        await app.EnsureDatabaseCreated();
    }

    private static async Task EnsureDatabaseCreated(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
    }

    private static void UseScalar(this WebApplication app)
    {
        app.MapScalarApiReference(o => { o.WithTitle("Serene API"); });
    }
}