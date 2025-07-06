using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NodaTime.Extensions;
using Serene.API.Common;
using Serene.API.Common.Exceptions;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Services;

namespace Serene.API.Features.Auth.Endpoints;

/// <summary>
///     Called from the client
/// </summary>
public class GetGoogleCallback : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/auth/login/callback", Handle)
            .WithName("GoogleLoginCallback")
            .WithSummary("Callback for Google logins")
            .WithTags(Tags.Auth);

    private async Task<IResult> Handle([FromQuery] string returnUrl,
        UserManager<User> userManager, HttpContext context, IJwtService jwtService)
    {
        var result = await context.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
        if (!result.Succeeded) return TypedResults.Unauthorized();

        var loginResult = await LoginWithGoogleAsync(result.Principal, userManager);

        if (!loginResult.IsSuccess) return loginResult.MapTypedResult(context);
        var user = loginResult.Value;

        var (accessToken, expirationDate) = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        var refreshTokenExpirationDate = DateTime.UtcNow.AddDays(7);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpirationDate = refreshTokenExpirationDate.ToInstant();

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            throw new ApiException(StatusCodes.Status500InternalServerError, "UpdateUserError",
                "Failed to update user with tokens");

        jwtService.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", accessToken, expirationDate);
        jwtService.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, refreshTokenExpirationDate);
        return TypedResults.Redirect(returnUrl);
    }

    private async Task<Result<User>> LoginWithGoogleAsync(ClaimsPrincipal principal, UserManager<User> userManager)
    {
        if (principal.Identity is null)
            return Result<User>.BadRequest(new Error("", "Identity is null"));

        var email = principal.FindFirstValue(ClaimTypes.Email);
        if (email is null)
            return Result<User>.BadRequest(new Error("", "Email not found"));

        var user = await userManager.FindByEmailAsync(email);
        if (user is not null) return Result<User>.Success(user);

        //make a new user
        user = new User
        {
            Email = email,
            UserName = principal.Identity.Name,
            CountryCode = principal.FindFirstValue(ClaimTypes.Country) ?? string.Empty,
            Pronouns = string.Empty,
            Gender = Enum.Parse<Gender>(principal.FindFirstValue(ClaimTypes.Gender) ?? string.Empty)
        };

        var result = await userManager.CreateAsync(user);
        if (!result.Succeeded)
            Result<User>.InternalServerError(new Error("", "Failed to create user with Google"));

        var info = new UserLoginInfo("Google", principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty, "Google");
        var loginResult = await userManager.AddLoginAsync(user, info);

        if (!loginResult.Succeeded)
            Result<User>.InternalServerError(new Error("", "Failed to add Google login to user"));

        return Result<User>.Success(user);
    }
}