using FluentValidation;
using FluentValidation.AspNetCore;
using Google.GenAI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using NodaTime;
using NodaTime.Serialization.SystemTextJson;
using Npgsql;
using OpenAI;
using OpenAI.Chat;
using Quartz;
using Quartz.AspNetCore;
using Scalar.AspNetCore;
using Serene.Data;
using Serene.Entities;
using Serene.Jobs;
using Serene.Middleware;
using Serene.Services;
using Serene.Validators;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using System.ClientModel;

Log.Logger = new LoggerConfiguration()
    .CreateBootstrapLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.Services.AddSerilog((context, loggerConfiguration) =>
    {
        loggerConfiguration.WriteTo.Console(theme: AnsiConsoleTheme.Code, applyThemeToRedirectedOutput: true, restrictedToMinimumLevel: LogEventLevel.Information);
        loggerConfiguration.MinimumLevel.Debug();
        loggerConfiguration.ReadFrom.Configuration(builder.Configuration);

        loggerConfiguration.Enrich.FromLogContext();
        loggerConfiguration.Enrich.WithProperty("Application", "YourAppName");
        loggerConfiguration.Enrich.WithProperty("Environment", Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"));
    });

    Log.Information("Starting web application");

    builder.Services.AddStackExchangeRedisCache(o =>
    {
        o.Configuration = builder.Configuration.GetConnectionString("Redis");
    });

    builder.Services.AddHybridCache(o =>
    {
        o.DefaultEntryOptions = new HybridCacheEntryOptions
        {
            Expiration = TimeSpan.FromSeconds(10),
            LocalCacheExpiration = TimeSpan.FromSeconds(5)
        };
    });



    builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ConfigureForNodaTime(DateTimeZoneProviders.Tzdb);
        })
        .ConfigureApiBehaviorOptions(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                var errors = context.ModelState
                    .Where(e => e.Value?.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value?.Errors.Select(x => x.ErrorMessage).ToArray()
                    );

                return new BadRequestObjectResult(new
                {
                    isSuccess = false,
                    data = (object?)null,
                    error = "One or more validation errors occurred.",
                    errorCode = "VALIDATION_ERROR",
                    errors = errors
                });
            };
        });


    builder.Services.AddFluentValidationAutoValidation();
    builder.Services.AddValidatorsFromAssemblyContaining<EmailSignUpRequestValidator>();


    builder.Services.AddOpenApi();

    var connectionString = builder.Configuration.GetConnectionString("Postgres")
        ?? throw new ArgumentException("DB string not provided");

    var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
    dataSourceBuilder.EnableDynamicJson(); //for dict mapping
    dataSourceBuilder.UseNodaTime();
    dataSourceBuilder.UseVector();
    var dataSource = dataSourceBuilder.Build();


    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(dataSource, o =>
        {
            o.UseNodaTime();
            o.UseVector();
        }));


    builder.Services.AddIdentityCore<User>(options =>
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


    builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
    builder.Services.AddProblemDetails();

    builder.Services.AddScoped<TokenService>();
    builder.Services.AddScoped<IOnboardingService, OnboardingService>();
    builder.Services.AddScoped<IAuthService, AuthService>();
    builder.Services.AddScoped<IUsersService, UsersService>();
    builder.Services.AddScoped<IPreferencesService, PreferencesService>();
    builder.Services.AddScoped<ICommunityService, CommunityService>();
    builder.Services.AddScoped<ICheckinService, CheckinService>();
    builder.Services.AddScoped<IEmbeddingService, EmbeddingService>();
    builder.Services.AddScoped<IExploreService, ExploreService>();
    // builder.Services.AddScoped<IAIService, GeminiService>();
    builder.Services.AddScoped<IAIService, OpenAIService>();

    builder.Services.AddScoped(x => new Client(apiKey: builder.Configuration["GEMINI_API_KEY"] ?? throw new ArgumentException("Gemini API key not found in environment")));
    builder.Services.AddScoped(x => new ChatClient(
        credential: new ApiKeyCredential(builder.Configuration["OPENROUTER_API_KEY"]
            ?? throw new ArgumentException("Gemini API key not found in environment")),
        model: "openai/gpt-oss-20b",
        options: new OpenAIClientOptions
        {
            Endpoint = new Uri("https://openrouter.ai/api/v1")
        }));

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddCookie("ExternalCookie")
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Authentication:Jwt:Authority"];
        options.Audience = builder.Configuration["Authentication:Jwt:Audience"];
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();

        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Authentication:Jwt:Authority"],
            ValidAudience = builder.Configuration["Authentication:Jwt:Audience"],
            IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
                System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Authentication:Jwt:Key"] ?? throw new Exception("Missing Jwt Key in configuration")))
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                //gets the jwt token from the clients' request cookies and puts it in the context
                if (context.Request.Cookies.ContainsKey("session_token"))
                {
                    context.Token = context.Request.Cookies["session_token"];
                }
                return Task.CompletedTask;
            }
        };
    })
    .AddGoogle(o =>
    {

        o.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? throw new ArgumentException("Missing Client ID");
        o.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? throw new ArgumentException("Missing Client Secret");
        o.Scope.Add("profile");
        o.SignInScheme = "ExternalCookie";
    });


    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? throw new ArgumentException("Missing Cors Origins"))
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });

    builder.Services.AddQuartz(options =>
    {
        var jobKey = new JobKey("SendQOTDJob");
        options.AddJob<SendQOTDJob>(opts => opts.WithIdentity(jobKey));

        options.AddTrigger(opts => opts
            .ForJob(jobKey)
            .WithIdentity("SendQOTDJob-trigger")
            .WithCronSchedule("0 0 0 * * ?") // Run at midnight every day
        );

    });

    builder.Services.AddQuartzServer(options =>
    {
        // when shutting down we want jobs to complete gracefully
        options.WaitForJobsToComplete = true;
    });

    // Add startup service to check and run QOTD if needed
    builder.Services.AddHostedService<QOTDStartupService>();

    var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();
        app.UseHttpsRedirection();

        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
            options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
            {
                diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value);
                diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);
                diagnosticContext.Set("UserAgent", httpContext.Request.Headers["User-Agent"].FirstOrDefault());
                // Add custom business context
                if (httpContext.User.Identity.IsAuthenticated)
                {
                    diagnosticContext.Set("UserId", httpContext.User.FindFirst("sub")?.Value);
                }
            };
        });
    }

    // Configure Forwarded Headers to handle Render's reverse proxy
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    });

    app.UseExceptionHandler();

    app.UseCors();

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            await DbInitializer.InitializeAsync(services);
            await DbInitializer.PromoteUserToAdminAsync(services, "test@test.com");
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