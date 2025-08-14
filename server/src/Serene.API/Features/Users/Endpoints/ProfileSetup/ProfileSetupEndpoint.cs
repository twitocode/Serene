using System.Globalization;
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

namespace Serene.API.Features.Users.Endpoints.ProfileSetup;

public class ProfileSetupEndpoint : IEndpoint
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
                return Result<string>.Unauthorized(new Error(AppErrors.UserUpdateError, "User has already completed their profile"));

            var id = context.User.GetUserId();
            var user = await userManager.FindByIdAsync(id.ToString());

            if (user is null) return Result<string>.BadRequest(new Error(AppErrors.UserNotFound, "User was not found"));
            if (user.IsSetupCompleted)
                return Result<string>.BadRequest(new Error(AppErrors.UserUpdateError,
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
                return Result<string>.InternalServerError(new Error(AppErrors.UserUpdateError,
                    $"Failed to update the User {user.Email}'s profile"));

            return Result<string>.Success($"Successfully completed User {user.Email}'s profile");
        }

        private LocalDate GetUserDateOfBirth(string dob)
        {
            var parsedDateTime = DateOnly.ParseExact(dob,
                "O", //2007-04-19
                CultureInfo.InvariantCulture,
                DateTimeStyles.None);

            return LocalDate.FromDateOnly(parsedDateTime);
        }
    }
