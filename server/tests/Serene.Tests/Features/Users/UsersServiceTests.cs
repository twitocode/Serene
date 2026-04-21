using Bogus;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Users;
using Shouldly;

namespace Serene.Tests.Features.Users;

public class UsersServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly ILogger<UsersService> _logger;
    private readonly HybridCache _cache;
    private readonly UsersService _sut;
    private readonly Faker _faker = new Faker();

    public UsersServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);

        _userManager = Substitute.For<UserManager<User>>(
            Substitute.For<IUserStore<User>>(),
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!
        );

        _logger = Substitute.For<ILogger<UsersService>>();
        _cache = Substitute.For<HybridCache>();
        _sut = new UsersService(_context, _userManager, _logger, _cache);
    }

    [Fact]
    public async Task GetUserProfileAsync_WhenUserExists_ReturnsProfile()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = _faker.Internet.Email(),
            Name = _faker.Name.FullName(),
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _cache
            .GetOrCreateAsync<UserResponse>(
                Arg.Any<string>(),
                Arg.Any<Func<CancellationToken, ValueTask<UserResponse>>>(),
                Arg.Any<HybridCacheEntryOptions>(),
                Arg.Any<IEnumerable<string>>(),
                Arg.Any<CancellationToken>()
            )
            .Returns(x =>
            {
                var factory = x.ArgAt<Func<CancellationToken, ValueTask<UserResponse>>>(1);
                return factory(CancellationToken.None);
            });

        _userManager.FindByIdAsync(user.Id).Returns(user);
        _userManager.GetRolesAsync(user).Returns(new List<string> { "User" });

        // Act
        var result = await _sut.GetUserProfileAsync(user.Id);

        // Assert
        result.ShouldNotBeNull();
        result.Id.ShouldBe(user.Id);
        result.Email.ShouldBe(user.Email);
        result.Roles.ShouldContain("User");
    }

    [Fact]
    public async Task UpdateUserProfileAsync_UpdatesNameAndStruggles()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = _faker.Internet.Email(),
            Name = "Old Name",
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UpdateUserProfileRequest
        {
            Name = "New Name",
            Struggles = new List<string> { "Anxiety" },
        };

        // Mock GetUserProfileAsync which is called at the end
        _cache
            .GetOrCreateAsync<UserResponse>(
                Arg.Any<string>(),
                Arg.Any<Func<CancellationToken, ValueTask<UserResponse>>>(),
                Arg.Any<HybridCacheEntryOptions>(),
                Arg.Any<IEnumerable<string>>(),
                Arg.Any<CancellationToken>()
            )
            .Returns(
                new ValueTask<UserResponse>(new UserResponse { Id = user.Id, Name = "New Name" })
            );

        // Act
        var result = await _sut.UpdateUserProfileAsync(user.Id, dto);

        // Assert
        var updatedUser = await _context
            .Users.Include(u => u.Profile)
            .FirstAsync(u => u.Id == user.Id);
        updatedUser.Name.ShouldBe("New Name");
        updatedUser.Profile.ShouldNotBeNull();
        updatedUser.Profile.Struggles.ShouldContain("Anxiety");

        await _cache.Received(1).RemoveByTagAsync($"profile-{user.Id}");
    }

    [Fact]
    public async Task DoesUserExistAsync_ReturnsTrue_WhenUserExists()
    {
        // Arrange
        var email = _faker.Internet.Email();
        var user = new User { Email = email, Id = Guid.NewGuid().ToString() };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.DoesUserExistAsync(email);

        // Assert
        result.ShouldBeTrue();
    }

    [Fact]
    public async Task ChangePasswordAsync_WhenUserHasPassword_ChangesPassword()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var user = new User { Id = userId };
        var dto = new ChangePasswordRequest
        {
            CurrentPassword = "OldPassword123!",
            NewPassword = "NewPassword123!",
        };

        _userManager.FindByIdAsync(userId).Returns(user);
        _userManager.HasPasswordAsync(user).Returns(true);
        _userManager
            .ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword)
            .Returns(IdentityResult.Success);

        // Act
        await _sut.ChangePasswordAsync(userId, dto);

        // Assert
        await _userManager
            .Received(1)
            .ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
    }
}
