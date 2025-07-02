using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;

namespace Serene.API.Auth.Endpoints;

public class Register : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapPost("/register", Handle).WithSummary("Registers a user").WithRequestValidation<RequestValidator>();
    }

    private static async Task<Results<Ok<Response>, ValidationError>> Handle([FromBody] Request request,
        UserManager<User> userManager)
    {
        var userExists = await userManager.FindByEmailAsync(request.Email) is not null;

        if (userExists) return new ValidationError("Email already exists");

        User user = new()
        {
            CountryCode = request.CountryCode,
            Email = request.Email,
            AvatarUrl = request.AvatarUrl ?? DefaultData.DefaultAvatarUrl
        };
        user.PasswordHash = userManager.PasswordHasher.HashPassword(user, request.Password);

        var result = await userManager.CreateAsync(user);

        if (!result.Succeeded)
            //change this later
            return new ValidationError("Failed to create user");
        return TypedResults.Ok(new Response());
    }

    public record Request(string Email, string Password, string CountryCode, string? AvatarUrl);

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

            RuleFor(x => x.CountryCode)
                .NotEmpty()
                .Length(2);

            RuleFor(x => x.AvatarUrl)
                .NotEmpty();
        }
    }
}