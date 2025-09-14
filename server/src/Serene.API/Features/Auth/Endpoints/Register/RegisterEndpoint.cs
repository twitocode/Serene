using System.Net.Security;
using System.Text.RegularExpressions;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Auth.Endpoints.Register;

public class RegisterEndpoint : IEndpoint
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
            return Result<string>.BadRequest(new Error(AppErrors.UserAlreadyExists, "User already exists with the email"));

        var user = new User
        {
            UserName = registerRequest.Email,
            Email = registerRequest.Email,
        };

        user.PasswordHash = userManager.PasswordHasher.HashPassword(user, registerRequest.Password);
        var result = await userManager.CreateAsync(user);

        if (!result.Succeeded)
            return Result<string>.InternalServerError(new Error(AppErrors.UserUpdateError, "Failed to create user"));

        return Result<string>.Success("Successfully created user");
    }

   
}