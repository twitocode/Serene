using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NodaTime.Extensions;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Services;

namespace Serene.API.Features.Auth.Endpoints;

public class Login(ILogger<Login> logger) : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app)
    {
        return app.MapPost("/auth/login", async ([FromBody] LoginRequest loginRequest,
                UserManager<User> userManager, IJwtService jwtService, HttpContext context) =>
            {
                var result = await Handle(loginRequest, userManager, jwtService);
                return result.MapTypedResult(context);
            })
            .WithSummary("Logs in a user")
            .WithRequestValidation<LoginRequest>()
            .WithTags(Tags.Auth);
    }

    private async Task<Result<string>> Handle(LoginRequest loginRequest,
        UserManager<User> userManager, IJwtService jwtService)
    {
        var user = await userManager.FindByEmailAsync(loginRequest.Email);

        if (user is not null)
        {
            if (string.IsNullOrEmpty(user.PasswordHash)) logger.LogWarning("User does not have a password");
            if (!await userManager.CheckPasswordAsync(user, loginRequest.Password))
                return Result<string>.BadRequest(
                    new Error("", "Password was invalid or registered with an external provider")
                );

            var (accessToken, expirationDate) = jwtService.GenerateToken(user);
            var refreshToken = jwtService.GenerateRefreshToken();

            var refreshTokenExpirationDate = DateTime.UtcNow.AddDays(7);
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpirationDate = refreshTokenExpirationDate.ToInstant();

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return Result<string>.InternalServerError(new Error("", "Failed to update user with tokens"));

            jwtService.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", accessToken, expirationDate);
            jwtService.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, refreshTokenExpirationDate);

            return Result<string>.Success("Successfully logged in");
        }

        return Result<string>.BadRequest(
            new Error("", $"User not found with email {loginRequest.Email}")
        );
    }
}

public record LoginRequest(string Email, string Password);

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty().MinimumLength(6).MaximumLength(30);
    }
}