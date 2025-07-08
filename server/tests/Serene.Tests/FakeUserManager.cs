// FakeUserManager.cs

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using NSubstitute;
using Serene.API.Data.Entities;

namespace Serene.Tests;

public class FakeUserManager(
    IUserStore<User> store,
    IOptions<IdentityOptions> optionsAccessor,
    IPasswordHasher<User> passwordHasher,
    IEnumerable<IUserValidator<User>> userValidators,
    IEnumerable<IPasswordValidator<User>> passwordValidators,
    ILookupNormalizer keyNormalizer,
    IdentityErrorDescriber errors,
    IServiceProvider services,
    ILogger<UserManager<User>> logger)
    : UserManager<User>(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer,
        errors,
        services, logger)
{
    // Override the Logger property so it can be intercepted by NSubstitute.
    public override ILogger Logger { get; set; } = new NullLogger<UserManager<User>>();

    public static UserManager<User> GetMockUserManager(IUserStore<User> userStoreMock)
    {
        var identityOptions = new IdentityOptions();
        var options = Substitute.For<IOptions<IdentityOptions>>();
        options.Value.Returns(identityOptions);

        var logger = new NullLogger<UserManager<User>>();
        var passwordHasher = Substitute.For<IPasswordHasher<User>>();
        var userValidators = new List<IUserValidator<User>> { new UserValidator<User>() };
        var passwordValidators = new List<IPasswordValidator<User>> { new PasswordValidator<User>() };
        var lookupNormalizer = Substitute.For<ILookupNormalizer>();
        var errorDescriber = Substitute.For<IdentityErrorDescriber>();
        var serviceProvider = Substitute.For<IServiceProvider>();

        // Create a partial substitute for UserManager<User>
        return Substitute.For<FakeUserManager>(
            userStoreMock,
            options,
            passwordHasher,
            userValidators,
            passwordValidators,
            lookupNormalizer,
            errorDescriber,
            serviceProvider,
            logger);
    }
}