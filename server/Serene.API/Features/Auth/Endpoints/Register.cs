using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Auth.Endpoints;

public class Register : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app)
    {
        return app.MapPost("/auth/register", async ([FromBody] RegisterRequest registerRequest,
                UserManager<User> userManager) =>
            {
                var result = await Handle(registerRequest, userManager);
                return result.MapTypedResult();
            })
            .WithSummary("Registers a user")
            .WithRequestValidation<RegisterRequest>()
            .WithTags(Tags.Auth);
    }

    private static async Task<Result<string>> Handle(RegisterRequest registerRequest,
        UserManager<User> userManager)
    {
        var userExists = await userManager.FindByEmailAsync(registerRequest.Email) is not null;

        if (userExists)
            return Result<string>.Failure(Error.BadRequest("User already exists with the email"));

        var user = new User
        {
            UserName = registerRequest.Email,
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName,
            CountryCode = registerRequest.CountryCode,
            Email = registerRequest.Email,
            AvatarUrl = registerRequest.AvatarUrl ?? DefaultData.DefaultAvatarUrl,
            Pronouns = registerRequest.Pronouns,
            Gender = Enum.Parse<Gender>(registerRequest.Gender) //might break later
        };

        user.PasswordHash = userManager.PasswordHasher.HashPassword(user, registerRequest.Password);

        var result = await userManager.CreateAsync(user);

        if (!result.Succeeded)
            return Result<string>.Failure(Error.InternalServerError("Failed to create user"));


        return Result<string>.Success("Successfully created user");
    }

    public record RegisterRequest(
        string Email,
        string Password,
        string FirstName,
        string LastName,
        string CountryCode,
        string? AvatarUrl,
        string Pronouns,
        string Gender);

    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty().MinimumLength(6).MaximumLength(30);

            RuleFor(x => x.CountryCode)
                // .Length(2)
                .NotEmpty();

            // RuleFor(x => x.AvatarUrl)
            //     .NotEmpty();

            RuleFor(x => x.Pronouns)
                .NotEmpty();

            //make a custom rule for enums
            RuleFor(x => x.Gender)
                .IsEnumName(typeof(Gender), false)
                .NotEmpty();

            RuleFor(x => x.FirstName)
                .NotEmpty();

            RuleFor(x => x.LastName)
                .NotEmpty();
        }
    }
}