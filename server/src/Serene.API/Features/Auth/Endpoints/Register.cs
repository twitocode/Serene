using System.Text.RegularExpressions;
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
                UserManager<User> userManager,
                HttpContext context, CancellationToken cancellationToken) =>
            {
                var result = await Handle(registerRequest, userManager, cancellationToken);
                return result.MapTypedResult(context);
            })
            .WithSummary("Registers a user")
            .WithRequestValidation<RegisterRequest>()
            .WithTags(Tags.Auth);
    }

    private async Task<Result<string>> Handle(RegisterRequest registerRequest, UserManager<User> userManager,
        CancellationToken cancellationToken)
    {
        var userExists = await userManager.FindByEmailAsync(registerRequest.Email) is not null;

        if (userExists)
            return Result<string>.BadRequest(new Error("", "User already exists with the email"));

        var user = new User
        {
            UserName = registerRequest.Email,
            Email = registerRequest.Email,
        };

        user.PasswordHash = userManager.PasswordHasher.HashPassword(user, registerRequest.Password);
        var result = await userManager.CreateAsync(user);

        if (!result.Succeeded)
            return Result<string>.InternalServerError(new Error("", "Failed to create user"));

        return Result<string>.Success("Successfully created user");
    }

    public record RegisterRequest(
        string Email,
        string Password
      );

    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required.")
                .Must(BeAValidEmailAddress)
                .WithMessage("Invalid email address.");

            RuleFor(x => x.Password)
                .NotEmpty().MinimumLength(6).MaximumLength(30);
        }
        
        
        private bool BeAValidEmailAddress(string email)
        {
            // Basic regex for email validation (can be replaced with a more robust one)
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }
    }
}