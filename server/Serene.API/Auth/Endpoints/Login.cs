using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NodaTime.Extensions;
using Serene.API.Auth.Services;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;

namespace Serene.API.Auth.Endpoints;

public class Login : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapPost("/login", Handle).WithSummary("Logs in a user").WithRequestValidation<RequestValidator>();
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle([FromBody] Request request,
        UserManager<User> userManager, IJwtService jwtService)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
            return new ValidationError("Invalid email or password");

        var (accessToken, expirationDate) = jwtService.GenerateToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();

        var refreshTokenExpirationDate = DateTime.Now.AddDays(7);
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpirationDate = refreshTokenExpirationDate.ToInstant();

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
            //change this later
            return new ValidationError("Failed to update user with tokens");

        jwtService.WriteAuthTokenAsHttpOnlyCookie("ACCESS_TOKEN", accessToken, expirationDate);
        jwtService.WriteAuthTokenAsHttpOnlyCookie("REFRESH_TOKEN", refreshToken, refreshTokenExpirationDate);

        return TypedResults.Ok(new Response());
    }

    public record Request(string Email, string Password);

    public record Response;

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty().MinimumLength(6).MaximumLength(30);
        }
    }
}