using Bogus;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Activities;
using Serene.Services;
using Shouldly;

namespace Serene.Tests.Features.Activities;

public class ActivityServiceTests : IDisposable
{
    private readonly TestApplicationDbContext _context;
    private readonly IAchievementService _achievementService;
    private readonly ActivityService _sut;
    private readonly string _userId = Guid.NewGuid().ToString();
    private static readonly Faker Faker = new Faker();

    public ActivityServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _achievementService = Substitute.For<IAchievementService>();
        _sut = new ActivityService(_context, _achievementService);
    }

    [Fact]
    public async Task GetActivitiesAsync_ShouldReturnActivitiesForUser()
    {
        // Arrange
        var activity = new ScheduledActivity
        {
            UserId = _userId,
            Title = Faker.Commerce.ProductName(),
            Category = Faker.Commerce.Categories(1)[0],
            ScheduledDate = new LocalDate(2024, 1, 1),
        };
        _context.ScheduledActivities.Add(activity);

        var otherUserActivity = new ScheduledActivity
        {
            UserId = Guid.NewGuid().ToString(),
            Title = Faker.Commerce.ProductName(),
            Category = Faker.Commerce.Categories(1)[0],
            ScheduledDate = new LocalDate(2024, 1, 1),
        };
        _context.ScheduledActivities.Add(otherUserActivity);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetActivitiesAsync(_userId, null, null);

        // Assert
        result.Count.ShouldBe(1);
        result[0].Id.ShouldBe(activity.Id);
        result[0].Title.ShouldBe(activity.Title);
    }

    [Fact]
    public async Task GetActivitiesAsync_WithDateFilters_ShouldReturnFilteredActivities()
    {
        // Arrange
        var from = new LocalDate(2024, 1, 2);
        var to = new LocalDate(2024, 1, 4);

        var activity1 = new ScheduledActivity
        {
            UserId = _userId,
            Title = "A1",
            ScheduledDate = new LocalDate(2024, 1, 1),
        };
        var activity2 = new ScheduledActivity
        {
            UserId = _userId,
            Title = "A2",
            ScheduledDate = new LocalDate(2024, 1, 3),
        };
        var activity3 = new ScheduledActivity
        {
            UserId = _userId,
            Title = "A3",
            ScheduledDate = new LocalDate(2024, 1, 5),
        };

        _context.ScheduledActivities.AddRange(activity1, activity2, activity3);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetActivitiesAsync(_userId, from, to);

        // Assert
        result.Count.ShouldBe(1);
        result[0].Title.ShouldBe("A2");
    }

    [Fact]
    public async Task CreateActivityAsync_ShouldCreateActivity()
    {
        // Arrange
        var request = new CreateActivityRequest
        {
            Title = "  New Activity  ",
            Category = " Fitness ",
            ScheduledDate = "2024-01-15",
        };

        // Act
        var result = await _sut.CreateActivityAsync(_userId, request);

        // Assert
        result.ShouldNotBeNull();
        result.Title.ShouldBe("New Activity");
        result.Category.ShouldBe("Fitness");
        result.ScheduledDate.ShouldBe("2024-01-15");

        var dbActivity = await _context.ScheduledActivities.FirstOrDefaultAsync(a =>
            a.Id == result.Id
        );
        dbActivity.ShouldNotBeNull();
        dbActivity.UserId.ShouldBe(_userId);
    }

    [Fact]
    public async Task CreateActivityAsync_WithInvalidDate_ShouldThrowArgumentException()
    {
        // Arrange
        var request = new CreateActivityRequest { Title = "Test", ScheduledDate = "invalid-date" };

        // Act & Assert
        await Should.ThrowAsync<ArgumentException>(() =>
            _sut.CreateActivityAsync(_userId, request)
        );
    }

    [Fact]
    public async Task CompleteActivityAsync_ShouldMarkAsCompletedAndCheckAchievements()
    {
        // Arrange
        var activity = new ScheduledActivity
        {
            UserId = _userId,
            Title = "Task",
            ScheduledDate = new LocalDate(2024, 1, 1),
            Completed = false,
        };
        _context.ScheduledActivities.Add(activity);
        await _context.SaveChangesAsync();

        var request = new CompleteActivityRequest { MoodBefore = 3, MoodAfter = 5 };

        // Act
        var result = await _sut.CompleteActivityAsync(_userId, activity.Id, request);

        // Assert
        result.Completed.ShouldBeTrue();
        result.MoodBefore.ShouldBe(3);
        result.MoodAfter.ShouldBe(5);
        result.CompletedAt.ShouldNotBeNull();

        await _achievementService.Received(1).CheckAndGrantAchievementsAsync(_userId);
    }

    [Fact]
    public async Task CompleteActivityAsync_WithNonExistentActivity_ShouldThrowKeyNotFoundException()
    {
        // Act & Assert
        await Should.ThrowAsync<KeyNotFoundException>(() =>
            _sut.CompleteActivityAsync(_userId, "non-existent", new CompleteActivityRequest())
        );
    }

    [Fact]
    public async Task DeleteActivityAsync_ShouldRemoveActivity()
    {
        // Arrange
        var activity = new ScheduledActivity
        {
            UserId = _userId,
            Title = "Delete Me",
            ScheduledDate = new LocalDate(2024, 1, 1),
        };
        _context.ScheduledActivities.Add(activity);
        await _context.SaveChangesAsync();

        // Act
        await _sut.DeleteActivityAsync(_userId, activity.Id);

        // Assert
        var dbActivity = await _context.ScheduledActivities.FindAsync(activity.Id);
        dbActivity.ShouldBeNull();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
