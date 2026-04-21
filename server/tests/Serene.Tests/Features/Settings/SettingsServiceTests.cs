using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.UserSettings;
using Shouldly;

namespace Serene.Tests.Features.Settings;

public class SettingsServiceTests
{
    private static readonly Faker<User> UserFaker = new Faker<User>()
        .UseSeed(42)
        .RuleFor(u => u.Id, f => f.Random.Guid().ToString())
        .RuleFor(u => u.Email, f => f.Internet.Email())
        .RuleFor(u => u.Name, f => f.Name.FullName());

    private static readonly Faker<Serene.Entities.Settings> SettingsFaker =
        new Faker<Serene.Entities.Settings>()
            .UseSeed(42)
            .RuleFor(s => s.Id, f => f.Random.Guid().ToString())
            .RuleFor(s => s.Theme, f => f.PickRandom("Light", "Dark"))
            .RuleFor(s => s.PasswordLock, f => f.Random.String2(4, "0123456789"));

    private readonly ApplicationDbContext _context;
    private readonly ILogger<SettingsService> _logger;
    private readonly HybridCache _cache;
    private readonly SettingsService _sut;

    public SettingsServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _logger = Substitute.For<ILogger<SettingsService>>();
        _cache = Substitute.For<HybridCache>();
        _sut = new SettingsService(_context, _logger, _cache);
    }

    [Fact]
    public async Task GetSettingsAsync_WhenSettingsExist_ReturnsSettings()
    {
        // Arrange
        var user = UserFaker.Generate();
        var settings = SettingsFaker.Generate();
        settings.UserId = user.Id;
        _context.Users.Add(user);
        _context.Settings.Add(settings);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetSettingsAsync(user.Id);

        // Assert
        result.ShouldNotBeNull();
        result.UserId.ShouldBe(user.Id);
        result.Theme.ShouldBe(settings.Theme);
    }

    [Fact]
    public async Task GetSettingsAsync_WhenSettingsDoNotExist_CreatesDefaultSettings()
    {
        // Arrange
        var user = UserFaker.Generate();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetSettingsAsync(user.Id);

        // Assert
        result.ShouldNotBeNull();
        result.UserId.ShouldBe(user.Id);
        result.Theme.ShouldBe("Light");
        result.PasswordLock.ShouldBeNull();

        var createdSettings = await _context.Settings.FirstOrDefaultAsync(s => s.UserId == user.Id);
        createdSettings.ShouldNotBeNull();
        createdSettings.Theme.ShouldBe("Light");
    }

    [Fact]
    public async Task GetSettingsAsync_WhenUserNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var nonExistentUserId = Guid.NewGuid().ToString();

        // Act & Assert
        await Should.ThrowAsync<KeyNotFoundException>(() =>
            _sut.GetSettingsAsync(nonExistentUserId)
        );
    }

    [Fact]
    public async Task UpdateSettingsAsync_WhenUserExists_UpdatesSettings()
    {
        // Arrange
        var user = UserFaker.Generate();
        var settings = SettingsFaker.Generate();
        settings.UserId = user.Id;
        user.Settings = settings;
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UpdateSettingsDto { Theme = "Dark", PasswordLock = "1234" };

        // Act
        var result = await _sut.UpdateSettingsAsync(user.Id, dto);

        // Assert
        result.Theme.ShouldBe("Dark");
        result.PasswordLock.ShouldBe("1234");

        var updatedSettings = await _context.Settings.FirstAsync(s => s.UserId == user.Id);
        updatedSettings.Theme.ShouldBe("Dark");
        updatedSettings.PasswordLock.ShouldBe("1234");

        await _cache.Received(1).RemoveByTagAsync($"profile-{user.Id}");
    }

    [Fact]
    public async Task UpdateSettingsAsync_WhenSettingsAreNull_CreatesNewSettings()
    {
        // Arrange
        var user = UserFaker.Generate();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var dto = new UpdateSettingsDto { Theme = "Dark" };

        // Act
        var result = await _sut.UpdateSettingsAsync(user.Id, dto);

        // Assert
        result.Theme.ShouldBe("Dark");

        var createdSettings = await _context.Settings.FirstOrDefaultAsync(s => s.UserId == user.Id);
        createdSettings.ShouldNotBeNull();
        createdSettings.Theme.ShouldBe("Dark");
    }

    [Fact]
    public async Task UpdateSettingsAsync_WhenUserNotFound_ThrowsKeyNotFoundException()
    {
        // Arrange
        var nonExistentUserId = Guid.NewGuid().ToString();
        var dto = new UpdateSettingsDto { Theme = "Dark" };

        // Act & Assert
        await Should.ThrowAsync<KeyNotFoundException>(() =>
            _sut.UpdateSettingsAsync(nonExistentUserId, dto)
        );
    }
}
