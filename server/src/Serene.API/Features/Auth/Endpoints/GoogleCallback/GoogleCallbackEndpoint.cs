using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NodaTime.Extensions;
using Serene.API.Common;
using Serene.API.Common.Exceptions;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Services;

namespace Serene.API.Features.Auth.Endpoints.GoogleCallback;

/// <summary>
///     Called from the client
/// </summary>
public class GoogleCallbackEndpoint(ILogger<GoogleCallbackEndpoint> logger)
    : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapGet("/auth/login/google/callback", Handle)
            .WithName("GoogleLoginCallback")
            .WithSummary("Callback for Google logins")
            .WithTags(Tags.Auth);

    private async Task<IResult> Handle([FromQuery] string returnUrl, UserManager<User> userManager,
        IJwtService jwtService, HttpContext context,
        CancellationToken cancellationToken)
    {
        var result = await context.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
        if (!result.Succeeded) return TypedResults.Unauthorized();

        var loginResult = await LoginWithGoogleAsync(result.Principal, userManager, cancellationToken);

        if (!loginResult.IsSuccess) return loginResult.MapTypedResult(context);
        var user = loginResult.Value;

        var (accessToken, expirationDate) = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        var refreshTokenExpirationDate = DateTime.UtcNow.AddDays(7);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpirationDate = refreshTokenExpirationDate.ToInstant();

        var updateResult = await userManager.UpdateAsync(user);
        foreach (var updateResultError in updateResult.Errors) logger.LogError(updateResultError.Description);
        if (!updateResult.Succeeded)
            throw new ApiException(StatusCodes.Status500InternalServerError, "UserUpdateError",
                "Failed to update user with tokens");

        jwtService.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", accessToken, expirationDate);
        jwtService.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, refreshTokenExpirationDate);
        return TypedResults.Redirect(returnUrl);
    }

    private async Task<Result<User>> LoginWithGoogleAsync(ClaimsPrincipal principal, UserManager<User> userManager,
        CancellationToken cancellationToken)
    {
        if (principal.Identity is null)
            return Result<User>.BadRequest(new Error(AppErrors.ClaimsIdentityNotFound, "Identity is null"));

        var email = principal.FindFirstValue(ClaimTypes.Email);
        if (email is null)
            return Result<User>.BadRequest(new Error(AppErrors.ClaimsEmailNotFound, "Email not found"));

        var user = await userManager.FindByEmailAsync(email);
        if (user is not null) return Result<User>.Success(user);

        var (firstName, lastName, countryCode, userGender, avatarUrl) = GetClaimDetails(principal);

        //make a new user
        user = new User
        {
            Email = email,
            FirstName = firstName ?? string.Empty,
            LastName = lastName ?? string.Empty,
            UserName = email.Split("@")[0] + Guid.NewGuid(), //test@test.com -> test2232-12323-23-23- temporary username
            AvatarUrl = avatarUrl ?? DefaultData.DefaultAvatarUrl,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user);
        if (!result.Succeeded)
            Result<User>.InternalServerError(new Error(AppErrors.AuthGoogleLoginError, "Failed to create user with Google"));

        var info = new UserLoginInfo("Google", principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty, "Google");
        var loginResult = await userManager.AddLoginAsync(user, info);

        if (!loginResult.Succeeded)
            Result<User>.InternalServerError(new Error(AppErrors.AuthGoogleLoginError, "Failed to add Google login to user"));

        return Result<User>.Success(user);
    }

    private (string? firstName, string? lastName, string countryCode, Gender userGender, string? avatarUrl)
        GetClaimDetails(ClaimsPrincipal principal)
    {
        // Extract First Name and Last Name
        var firstName = principal.FindFirstValue(ClaimTypes.GivenName);
        var lastName = principal.FindFirstValue(ClaimTypes.Surname);
        if (string.IsNullOrEmpty(lastName)) lastName = "<none>";

        // Extract Country Code (from ClaimTypes.Country or locale if not available)
        var countryCode = principal.FindFirstValue(ClaimTypes.Country) ??
                          principal.FindFirstValue("locale")?.Split('-').LastOrDefault()?.ToUpper() ??
                          string.Empty;

        // Extract Gender
        var userGender = Gender.None;
        var genderClaimValue = principal.FindFirstValue(ClaimTypes.Gender);

        if (!string.IsNullOrEmpty(genderClaimValue))
        {
            // Google's ClaimTypes.Gender can be "male", "female", "other", or "unspecified"
            if (genderClaimValue.Equals("male", StringComparison.OrdinalIgnoreCase))
                userGender = Gender.Male;
            else if (genderClaimValue.Equals("female", StringComparison.OrdinalIgnoreCase))
                userGender = Gender.Female;
            else if (genderClaimValue.Equals("non-binary", StringComparison.OrdinalIgnoreCase))
                userGender = Gender.NonBinary;
            else
                userGender = Gender.None; //Ask the user later on the client-side
        }

        // Extract AvatarUrl (from 'picture' claim, often available with profile scope)
        var avatarUrl = principal.FindFirstValue("picture");
        return (firstName, lastName, countryCode, userGender, avatarUrl);
    }
}