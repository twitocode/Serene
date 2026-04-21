using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Onboarding;
using Shouldly;
using Xunit;

namespace Serene.Tests.Features.Onboarding;

public class OnboardingServiceTests
{
    private static readonly Faker Faker = new Faker();
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OnboardingService> _logger;
    private readonly OnboardingService _sut;

    public OnboardingServiceTests()
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
        _logger = Substitute.For<ILogger<OnboardingService>>();
        _sut = new OnboardingService(_context, _logger);
    }

    [Fact]
    public async Task GetStatusAsync_WhenUserExists_ReturnsStatus()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Test User",
            OnboardingStep = 2,
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetStatusAsync(user.Id);

        // Assert
        result.Name.ShouldBe(user.Name);
        result.Step.ShouldBe(2);
    }

    [Fact]
    public async Task CompleteStep1Async_UpdatesNameAndStep()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var user = new User { Id = userId, OnboardingStep = 1 };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        var dto = new StepOneRequest { Name = "NewName" };

        // Act
        await _sut.CompleteStep1Async(userId, dto);

        // Assert
        var updatedUser = await _context.Users.FirstAsync(u => u.Id == userId);
        updatedUser.Name.ShouldBe("NewName");
        updatedUser.OnboardingStep.ShouldBe(2);
        updatedUser.OnboardingStarted.ShouldBeTrue();
    }

    [Fact]
    public async Task CompleteStep1Async_WhenNameTaken_ThrowsAppException()
    {
        // Arrange
        var user1 = new User { Id = Guid.NewGuid().ToString(), Name = "Taken" };
        var user2 = new User
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Available",
            OnboardingStep = 1,
        };
        _context.Users.AddRange(user1, user2);
        await _context.SaveChangesAsync();
        var dto = new StepOneRequest { Name = "Taken" };

        // Act & Assert
        await Should.ThrowAsync<Serene.Common.AppException>(() =>
            _sut.CompleteStep1Async(user2.Id, dto)
        );
    }

    [Fact]
    public async Task CompleteStep4Async_RegistersNewSchool_AndUpdatesProfile()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var user = new User { Id = userId, OnboardingStep = 4 };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        var dto = new StepFourRequest
        {
            Name = "New University",
            CountryCode = "CA",
            City = "Toronto",
            RegionCode = "ON",
        };

        // Act
        await _sut.CompleteStep4Async(userId, dto);

        // Assert
        var school = await _context.Schools.FirstOrDefaultAsync(s => s.Name == dto.Name);
        school.ShouldNotBeNull();
        var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
        profile!.SchoolId.ShouldBe(school.Id);
        var updatedUser = await _context.Users.FirstAsync(u => u.Id == userId);
        updatedUser.OnboardingStep.ShouldBe(5);
    }
}
