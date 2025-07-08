// FakeUserManager.cs

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using NSubstitute;
using Serene.API.Data.Entities;

namespace Serene.Tests;

public class FakeSignInManager(
    UserManager<User> userManager,
    IHttpContextAccessor contextAccessor,
    IUserClaimsPrincipalFactory<User> claimsFactory,
    IOptions<IdentityOptions> optionsAccessor,
    ILogger<SignInManager<User>> logger,
    IAuthenticationSchemeProvider schemes,
    IUserConfirmation<User> confirmation)
    : SignInManager<User>(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
{
    // Override the Logger property so it can be intercepted by NSubstitute.
    public override ILogger Logger { get; set; } = new NullLogger<UserManager<User>>();

    public static SignInManager<User> GetMockSignInManager(UserManager<User> userManager)
    {
        var identityOptions = new IdentityOptions();
        var options = Substitute.For<IOptions<IdentityOptions>>();
        options.Value.Returns(identityOptions);

        return Substitute.ForPartsOf<SignInManager<User>>
        (
            userManager,
            Substitute.For<IHttpContextAccessor>(),
            Substitute.For<IUserClaimsPrincipalFactory<User>>(),
            options,
            new NullLogger<SignInManager<User>>(),
            Substitute.For<IAuthenticationSchemeProvider>(),
            Substitute.For<IUserConfirmation<User>>()
        );
    }
}