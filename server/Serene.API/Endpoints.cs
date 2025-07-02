using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Serene.API.Auth.Endpoints;
using Serene.API.Common;
using Serene.API.Health.Endpoints;

namespace Serene.API;

public static class Endpoints
{
    private static readonly OpenApiSecurityScheme _SecurityScheme = new()
    {
        Type = SecuritySchemeType.Http,
        Name = JwtBearerDefaults.AuthenticationScheme,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = JwtBearerDefaults.AuthenticationScheme
        }
    };

    public static void MapApiEndpoints(this WebApplication app)
    {
        var endpoints = app.MapGroup("").WithOpenApi();

        endpoints.MapAuthEndpoints();
        endpoints.MapUsersEndpoints();
        endpoints.MapJournalsEndpoints();
        endpoints.MapGeneralEndpoints();
    }

    private static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/auth")
            .WithTags("Authentication");

        endpoints.MapPublicGroup()
            .MapEndpoint<Register>()
            .MapEndpoint<Login>()
            .MapEndpoint<GetRefreshToken>();
    }

    private static void MapUsersEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/users")
            .WithTags("Users");
    }

    private static void MapJournalsEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/journals")
            .WithTags("Journals");
    }

    private static void MapGeneralEndpoints(this IEndpointRouteBuilder app)
    {
        var endpoints = app.MapGroup("/")
            .WithTags("General Endpoints");

        endpoints.MapPublicGroup()
            .MapEndpoint<GetServerHealth>()
            .MapEndpoint<GetServerHealthAuthorized>();
    }

    private static RouteGroupBuilder MapPublicGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        return app.MapGroup(prefix ?? string.Empty)
            .AllowAnonymous();
    }


    private static RouteGroupBuilder MapAuthorizedGroup(this IEndpointRouteBuilder app, string? prefix = null)
    {
        return app.MapGroup(prefix ?? string.Empty)
            .RequireAuthorization()
            .WithOpenApi(x => new OpenApiOperation(x)
            {
                Security = [new OpenApiSecurityRequirement { [_SecurityScheme] = [] }]
            });
    }


    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app)
        where TEndpoint : IEndpoint
    {
        TEndpoint.Map(app);
        return app;
    }
}