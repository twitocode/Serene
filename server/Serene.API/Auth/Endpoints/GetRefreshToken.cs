using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NodaTime.Extensions;
using Serene.API.Auth.Services;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;

namespace Serene.API.Auth.Endpoints;

public class GetRefreshToken : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/refresh-token", Handle).WithSummary("Gets a new refresh token")
            .WithRequestValidation<RequestValidator>();
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle([FromBody] Request request,
        HttpContext httpContext,
        UserManager<User> userManager, IJwtService jwtService, AppDbContext db)
    {
        request.RefreshToken = httpContext.Request.Cookies["REFRESH_TOKEN"] ?? "";

        var user = await GetUserByRefreshToken(request.RefreshToken, db);
        if (user == null) return new ValidationError("Unable to retrieve user from refresh token");

        if (user.RefreshTokenExpirationDate < DateTime.UtcNow.ToInstant())
            return new ValidationError("Refresh token already expired");

        var (accessToken, expirationDate) = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        var refreshTokenExpirationDate = DateTime.Now.AddDays(7);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpirationDate = refreshTokenExpirationDate.ToInstant();

        jwtService.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", accessToken, expirationDate);
        jwtService.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, refreshTokenExpirationDate);
        return TypedResults.Ok(new Response());
    }

    private static async Task<User?> GetUserByRefreshToken(string refreshToken, AppDbContext db)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);
        return user;
    }

    public record Request
    {
        public required string RefreshToken { get; set; }
    }

    public record Response;

    public class RequestValidator : AbstractValidator<Request>
    {
    }
}