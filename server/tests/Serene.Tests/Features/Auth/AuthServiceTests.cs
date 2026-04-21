using System.Security.Claims;
using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Auth;
using Serene.Services;
using Shouldly;
using Xunit;

namespace Serene.Tests.Features.Auth;

public class AuthServiceTests
{
    private static readonly Faker Faker = new Faker();
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthService> _logger;
    private readonly HybridCache _cache;
    private readonly IStreakService _streakService;
    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .ConfigureWarnings(x =>
                x.Ignore(
                    Microsoft
                        .EntityFrameworkCore
                        .Diagnostics
                        .InMemoryEventId
                        .TransactionIgnoredWarning
                )
            )
            .Options;
        _context = new TestApplicationDbContext(options);

        var store = Substitute.For<IUserStore<User>>();
        _userManager = Substitute.For<UserManager<User>>(
            store,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!
        );

        var jwtOptions = Options.Create(
            new Serene.Configuration.JwtOptions
            {
                Key = "SecretKeyForTestingPurposesOnly123!",
                Authority = "SereneTest",
                Audience = "SereneTestAudience",
            }
        );
        _tokenService = new TokenService(jwtOptions);

        _logger = Substitute.For<ILogger<AuthService>>();
        _cache = Substitute.For<HybridCache>();
        _streakService = Substitute.For<IStreakService>();

        _sut = new AuthService(
            _userManager,
            _tokenService,
            _context,
            _logger,
            _cache,
            _streakService
        );
    }

    [Fact]
    public async Task CheckEmailAsync_WhenUserExists_ReturnsExistsTrue()
    {
        // Arrange
        var email = Faker.Internet.Email();
        var user = new User { Id = Guid.NewGuid().ToString(), Email = email };
        _userManager.FindByEmailAsync(email).Returns(user);
        _userManager.HasPasswordAsync(user).Returns(true);
        _userManager
            .GetLoginsAsync(user)
            .Returns(new List<UserLoginInfo> { new UserLoginInfo("Google", "sub", "Google") });

        // Act
        var result = await _sut.CheckEmailAsync(email);

        // Assert
        result.Exists.ShouldBeTrue();
        result.HasPassword.ShouldBeTrue();
        result.Providers.ShouldContain("credential");
        result.Providers.ShouldContain("Google");
    }

    [Fact]
    public async Task SignUpAsync_WhenUserExists_ThrowsArgumentException()
    {
        // Arrange
        var email = Faker.Internet.Email();
        _userManager.FindByEmailAsync(email).Returns(new User());

        // Act & Assert
        await Should.ThrowAsync<ArgumentException>(() =>
            _sut.SignUpAsync(new EmailSignUpRequest { Email = email })
        );
    }

    [Fact]
    public async Task SignInAsync_WhenCredentialsValid_ReturnsAuthResponse()
    {
        // Arrange
        var email = Faker.Internet.Email();
        var password = "Password123!";
        var user = new User { Id = Guid.NewGuid().ToString(), Email = email };

        _userManager.FindByEmailAsync(email).Returns(user);
        _userManager.CheckPasswordAsync(user, password).Returns(true);

        // Mock HybridCache to return an empty list of roles
        _cache
            .GetOrCreateAsync<IList<string>>(
                Arg.Any<string>(),
                Arg.Any<Func<CancellationToken, ValueTask<IList<string>>>>(),
                Arg.Any<HybridCacheEntryOptions>(),
                Arg.Any<IEnumerable<string>>(),
                Arg.Any<CancellationToken>()
            )
            .Returns(new ValueTask<IList<string>>(new List<string>()));

        // Act
        var result = await _sut.SignInAsync(
            new EmailSignInRequest { Email = email, Password = password }
        );

        // Assert
        result.ShouldNotBeNull();
        result.Token.ShouldNotBeNullOrEmpty();
        result.User.Email.ShouldBe(email);
        await _streakService.Received(1).UpdateStreakAsync(user.Id);
    }

    [Fact]
    public async Task HandleGoogleCallbackAsync_WhenNewUser_CreatesUserAndProfile()
    {
        // Arrange
        var email = Faker.Internet.Email();
        var principal = new ClaimsPrincipal(
            new ClaimsIdentity(
                new[]
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.Name, "Test User"),
                    new Claim(ClaimTypes.NameIdentifier, "google-id-123"),
                }
            )
        );

        _userManager.FindByEmailAsync(email).Returns((User?)null);
        _userManager.CreateAsync(Arg.Any<User>()).Returns(IdentityResult.Success);
        _userManager.GetLoginsAsync(Arg.Any<User>()).Returns(new List<UserLoginInfo>());
        _userManager
            .AddLoginAsync(Arg.Any<User>(), Arg.Any<UserLoginInfo>())
            .Returns(IdentityResult.Success);

        _cache
            .GetOrCreateAsync<IList<string>>(
                Arg.Any<string>(),
                Arg.Any<Func<CancellationToken, ValueTask<IList<string>>>>(),
                Arg.Any<HybridCacheEntryOptions>(),
                Arg.Any<IEnumerable<string>>(),
                Arg.Any<CancellationToken>()
            )
            .Returns(new ValueTask<IList<string>>(new List<string>()));

        // Act
        var result = await _sut.HandleGoogleCallbackAsync(principal);

        // Assert
        result.ShouldNotBeNull();
        result.User.Email.ShouldBe(email);
        await _userManager.Received(1).CreateAsync(Arg.Is<User>(u => u.Email == email));
        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId != null);
        profile.ShouldNotBeNull();
    }
}
