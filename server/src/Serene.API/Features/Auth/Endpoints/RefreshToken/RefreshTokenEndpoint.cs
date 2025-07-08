using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NodaTime.Extensions;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Services;

namespace Serene.API.Features.Auth.Endpoints.RefreshToken;

public class RefreshTokenEndpoint() : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app)
    {
        return app.MapPost("/auth/refresh-token", async (
                IJwtService jwtService, AppDbContext db, UserManager<User> userManager,
                HttpContext httpContext, CancellationToken cancellationToken
            ) =>
            {
                var result = await Handle(jwtService, db, userManager, httpContext,
                    cancellationToken);
                return result.MapTypedResult(httpContext);
            })
            .WithSummary("Gets a new refresh token")
            .WithTags(Tags.Auth);
    }

    public async Task<Result<string>> Handle(IJwtService jwtService,
        AppDbContext db, UserManager<User> userManager, HttpContext httpContext,
        CancellationToken cancellationToken)
    {
        var refreshTokenFromCookies = httpContext.Request.Cookies["REFRESH_TOKEN"] ?? "";

        var user = await GetUserByRefreshToken(refreshTokenFromCookies, db, cancellationToken);
        if (user == null)
            return Result<string>.InternalServerError(new Error("", "Unable to retrieve user from refresh token"));

        if (user.RefreshTokenExpirationDate < DateTime.UtcNow.ToInstant())
            return Result<string>.BadRequest(new Error("", "Refresh token already expired"));

        var (accessToken, expirationDate) = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        var refreshTokenExpirationDate = DateTime.UtcNow.AddDays(7);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpirationDate = refreshTokenExpirationDate.ToInstant();

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            return Result<string>.InternalServerError(new Error("", "Failed to update user with refresh tokens"));

        jwtService.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", accessToken, expirationDate);
        jwtService.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, refreshTokenExpirationDate);
        return Result<string>.Success("Successfully registered user and assigned token");
    }

    private async Task<User?> GetUserByRefreshToken(string refreshToken, AppDbContext db,
        CancellationToken cancellationToken)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken, cancellationToken);
        return user;
    }
}
