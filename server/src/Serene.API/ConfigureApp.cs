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
        app.UseCors();

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
}