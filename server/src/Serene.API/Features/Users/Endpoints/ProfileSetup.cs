using System.Globalization;
using System.Text.RegularExpressions;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Hybrid;
using NodaTime;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth;

namespace Serene.API.Features.Users.Endpoints;

public record ProfileSetupRequest(
    string FirstName,
    string LastName,
    string Username,
    string Country,
    string AvatarUrl,
    string Pronouns,
    string DateOfBirth,
    string Gender);

public class ProfileSetupValidator : AbstractValidator<ProfileSetupRequest>
{
    public ProfileSetupValidator()
    {
        RuleFor(x => x.FirstName)
            .MaximumLength(20)
            .NotEmpty();

        RuleFor(x => x.LastName)
            .MaximumLength(30)
            .NotEmpty();

        RuleFor(x => x.Username)
            .MaximumLength(15)
            .NotEmpty();

        RuleFor(x => x.Country)
            .Must(country => DefaultData.Countries.Contains(country))
            .NotEmpty();

        RuleFor(x => x.AvatarUrl)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .When(x => !string.IsNullOrEmpty(x.AvatarUrl));

        RuleFor(x => x.Pronouns)
            .Matches(_ =>
            {
                const string subjects = "(he|she|it|they)";
                const string objects = "(him|her|its|them)";

                return $"^{subjects}/{objects}$";
            }, RegexOptions.IgnoreCase)
            .NotEmpty();

        RuleFor(x => x.DateOfBirth)
            .Must(dob => DateTime.TryParseExact(
                dob,
                "d",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out _))
            .When(x => !string.IsNullOrEmpty(x.DateOfBirth));

        //make a custom rule for enums
        RuleFor(x => x.Gender)
            .IsEnumName(typeof(Gender), false)
            .NotEmpty();
    }

    public class ProfileSetup : IEndpoint
    {
        public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
            app.MapPost("/users/setup", async ([FromBody] ProfileSetupRequest request, HttpContext httpContext,
                    CancellationToken cancellationToken, HybridCache cache, IDistributedCache dCache,
                    UserManager<User> userManager) =>
                {
                    var result = await Handle(request, cache, dCache, userManager, httpContext, cancellationToken);
                    return result.MapTypedResult(httpContext);
                })
                .WithTags(Tags.Users)
                .WithSummary("Setup User Profile")
                .RequireAuthorization()
                .WithRequestValidation<ProfileSetupRequest>();

        private async Task<Result<string>> Handle(ProfileSetupRequest request, HybridCache cache,
            IDistributedCache dCache,
            UserManager<User> userManager, HttpContext context, CancellationToken cancellationToken)
        {
            if (context.User.GetIsSetupCompleted())
                return Result<string>.Unauthorized(new Error("", "User has already completed their profile"));

            var id = context.User.GetUserId();
            var user = await userManager.FindByIdAsync(id.ToString());

            if (user is null) return Result<string>.BadRequest(new Error("", "User was not found"));
            if (user.IsSetupCompleted)
                return Result<string>.BadRequest(new Error("",
                    "The user is already confirmed, you should not be here"));

            user.FirstName = string.IsNullOrEmpty(user.FirstName) ? request.FirstName : user.FirstName;
            user.LastName = string.IsNullOrEmpty(user.LastName) ? request.LastName : user.LastName;
            user.UserName = request.Username;
            user.Country = request.Country;

            user.AvatarUrl = user.AvatarUrl switch
            {
                DefaultData.DefaultAvatarUrl => request.AvatarUrl,
                _ => user.AvatarUrl
            };
            user.Pronouns = request.Pronouns;
            user.DateOfBirth = GetUserDateOfBirth(request.DateOfBirth);
            user.Gender = request.Gender.ToGender();
            user.IsSetupCompleted = true;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return Result<string>.InternalServerError(new Error("",
                    $"Failed to update the User {user.Email}'s profile"));

            return Result<string>.Success($"Successfully completed User {user.Email}'s profile");
        }

        private Instant GetUserDateOfBirth(string dob)
        {
            var parsedDateTime = DateTime.ParseExact(dob,
                "d",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None);

            var utcDateTime = DateTime.SpecifyKind(parsedDateTime, DateTimeKind.Utc);
            return Instant.FromDateTimeUtc(utcDateTime);
        }
    }
}