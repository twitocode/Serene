using System.Threading.RateLimiting;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using NodaTime;
using NodaTime.Serialization.SystemTextJson;
using Scalar.AspNetCore;
using Serene.Data;
using Serene.Extensions;
using Serene.Middleware;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;

Log.Logger = new LoggerConfiguration().CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    //used for railway deploying
    var port = Environment.GetEnvironmentVariable("PORT");
    if (!string.IsNullOrEmpty(port))
    {
        builder.WebHost.UseKestrel(options =>
        {
            options.ListenAnyIP(int.Parse(port));
        });
    }

    builder.Services.AddSerilog(
        (context, loggerConfiguration) =>
        {
            loggerConfiguration.WriteTo.Console(
                theme: AnsiConsoleTheme.Code,
                applyThemeToRedirectedOutput: true,
                restrictedToMinimumLevel: LogEventLevel.Information
            );
            loggerConfiguration.MinimumLevel.Debug();
            loggerConfiguration.ReadFrom.Configuration(builder.Configuration);

            loggerConfiguration.Enrich.FromLogContext();
            loggerConfiguration.Enrich.WithProperty("Application", "Serene");
            loggerConfiguration.Enrich.WithProperty(
                "Environment",
                Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")
            );
        }
    );

    Log.Information("Starting web application");

    builder.Services.AddConfigurationBindings(builder.Configuration);
    builder.Services.AddDatabaseServices(builder.Configuration);
    builder.Services.AddIdentityServices(builder.Configuration);
    builder.Services.AddApplicationServices(builder.Configuration);

    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders =
            ForwardedHeaders.XForwardedFor
            | ForwardedHeaders.XForwardedProto
            | ForwardedHeaders.XForwardedHost;
        options.KnownIPNetworks.Clear();
        options.KnownProxies.Clear();
        options.ForwardLimit = null;
    });

    builder.Services.AddRateLimiter(options =>
    {
        options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

        // 1. Global Policy: Sane default (100 req/min)
        options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
            RateLimitPartition.GetFixedWindowLimiter(
                partitionKey: httpContext.User.Identity?.Name
                    ?? httpContext.Connection.RemoteIpAddress?.ToString()
                    ?? "unknown",
                factory: partition => new FixedWindowRateLimiterOptions
                {
                    AutoReplenishment = true,
                    PermitLimit = 100,
                    QueueLimit = 2,
                    Window = TimeSpan.FromMinutes(1),
                }
            )
        );

        // 2. Strict Policy for Auth (5 req/min) - Prevent Brute Force
        options.AddFixedWindowLimiter(
            "auth-strict",
            opt =>
            {
                opt.PermitLimit = 5;
                opt.Window = TimeSpan.FromMinutes(1);
                opt.QueueLimit = 0;
            }
        );
    });

    builder
        .Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ConfigureForNodaTime(DateTimeZoneProviders.Tzdb);
        })
        .ConfigureApiBehaviorOptions(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context
                    .ModelState.Where(e => e.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value?.Errors.Select(x => x.ErrorMessage).ToArray()
                    );

                return new BadRequestObjectResult(
                    new
                    {
                        isSuccess = false,
                        data = (object?)null,
                        error = "One or more validation errors occurred.",
                        errorCode = "VALIDATION_ERROR",
                        errors = errors,
                    }
                );
            };
        });

    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<EmailSignUpRequestValidator>();

    builder.Services.AddOpenApi();

    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();
    builder
        .Services.AddHealthChecks()
        .AddCheck<Serene.HealthChecks.QuestionSystemHealthCheck>("question_system");

    if (builder.Environment.IsProduction())
    {
        builder
            .Services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo("/app/keys"))
            .SetApplicationName("Serene");
    }

    var app = builder.Build();

    app.Use(
        (context, next) =>
        {
            if (context.Request.Headers.TryGetValue("X-Forwarded-Proto", out var proto))
            {
                context.Request.Scheme = proto.ToString();
            }
            return next();
        }
    );

    app.UseForwardedHeaders();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();

        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate =
                "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                diagnosticContext.Set(
                    "UserAgent",
                    httpContext.Request.Headers["User-Agent"].FirstOrDefault()
                );

                if (httpContext.User.Identity is { IsAuthenticated: true })
                {
                    diagnosticContext.Set("UserId", httpContext.User.FindFirst("sub")?.Value);
                }
            };
        });
    }

    app.UseHttpsRedirection();

    app.UseRateLimiter();
    app.UseExceptionHandler();
    app.UseCors();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapHealthChecks("/health");

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            await DbInitializer.InitializeAsync(services);

            var context = services.GetRequiredService<ApplicationDbContext>();
            await AchievementSeedData.SeedAchievementsAsync(context);

            var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
            if (!string.IsNullOrEmpty(adminEmail))
            {
                await DbInitializer.PromoteUserToAdminAsync(services, adminEmail);
            }
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }

    app.Run();
}
catch (Exception ex)
{
    if (ex.GetType().Name is "HostAbortedException")
    {
        throw;
    }
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
