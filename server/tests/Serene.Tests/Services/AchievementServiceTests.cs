using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Services;
using Shouldly;
using Xunit;

namespace Serene.Tests.Services;

public class AchievementServiceTests
{
    private static readonly Faker Faker = new Faker();
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AchievementService> _logger;
    private readonly AchievementService _sut;

    public AchievementServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _logger = Substitute.For<ILogger<AchievementService>>();
        _sut = new AchievementService(_context, _logger);
    }

    [Fact]
    public async Task GetAllAchievementsAsync_ReturnsAchievementsWithCorrectStatus()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var achievement1 = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = "slug1",
            Title = "Title 1",
            Description = "Desc 1",
            Points = 10,
        };
        var achievement2 = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = "slug2",
            Title = "Title 2",
            Description = "Desc 2",
            Points = 20,
        };
        _context.Achievements.AddRange(achievement1, achievement2);

        _context.UserAchievements.Add(
            new UserAchievement { UserId = userId, AchievementId = achievement1.Id }
        );
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetAllAchievementsAsync(userId);

        // Assert
        result.Count.ShouldBe(2);
        result.ShouldContain(a => a.Id == achievement1.Id && a.Unlocked);
        result.ShouldContain(a => a.Id == achievement2.Id && !a.Unlocked);
    }

    [Fact]
    public async Task CheckAndGrantAchievementsAsync_GrantsFirstCheckin_WhenUserHasCheckin()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var achievement = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = "first-checkin",
            Title = "First Checkin",
            Description = "First",
            Points = 10,
        };
        _context.Achievements.Add(achievement);
        _context.Checkins.Add(
            new Checkin
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                MoodLabel = "Happy",
                PromptQuestion = "How are you?",
            }
        );
        await _context.SaveChangesAsync();

        // Act
        await _sut.CheckAndGrantAchievementsAsync(userId);

        // Assert
        var userAchievement = await _context.UserAchievements.FirstOrDefaultAsync(ua =>
            ua.UserId == userId && ua.AchievementId == achievement.Id
        );
        userAchievement.ShouldNotBeNull();
    }

    [Fact]
    public async Task CheckAndGrantAchievementsAsync_DoesNotGrantIfAlreadyExists()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var achievement = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = "first-checkin",
            Title = "First Checkin",
            Description = "First",
            Points = 10,
        };
        _context.Achievements.Add(achievement);
        _context.Checkins.Add(
            new Checkin
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                MoodLabel = "Happy",
                PromptQuestion = "How are you?",
            }
        );
        _context.UserAchievements.Add(
            new UserAchievement { UserId = userId, AchievementId = achievement.Id }
        );
        await _context.SaveChangesAsync();

        // Act
        await _sut.CheckAndGrantAchievementsAsync(userId);

        // Assert
        var count = await _context.UserAchievements.CountAsync(ua =>
            ua.UserId == userId && ua.AchievementId == achievement.Id
        );
        count.ShouldBe(1);
    }

    [Theory]
    [InlineData("streak-3", 3)]
    [InlineData("streak-7", 7)]
    [InlineData("streak-14", 14)]
    [InlineData("streak-30", 30)]
    public async Task CheckAndGrantAchievementsAsync_GrantsStreakAchievements(
        string slug,
        int streak
    )
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var achievement = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = slug,
            Title = slug,
            Description = slug,
            Points = 10,
        };
        _context.Achievements.Add(achievement);
        _context.Profiles.Add(new Profile { UserId = userId, LongestStreak = streak });
        await _context.SaveChangesAsync();

        // Act
        await _sut.CheckAndGrantAchievementsAsync(userId);

        // Assert
        var userAchievement = await _context.UserAchievements.FirstOrDefaultAsync(ua =>
            ua.UserId == userId && ua.AchievementId == achievement.Id
        );
        userAchievement.ShouldNotBeNull();
    }

    [Theory]
    [InlineData("checkin-10", 10)]
    [InlineData("checkin-25", 25)]
    [InlineData("checkin-50", 50)]
    [InlineData("checkin-100", 100)]
    public async Task CheckAndGrantAchievementsAsync_GrantsCheckinCountAchievements(
        string slug,
        int count
    )
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var achievement = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = slug,
            Title = slug,
            Description = slug,
            Points = 10,
        };
        _context.Achievements.Add(achievement);
        for (int i = 0; i < count; i++)
        {
            _context.Checkins.Add(
                new Checkin
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    MoodLabel = "Happy",
                    PromptQuestion = "How are you?",
                }
            );
        }
        await _context.SaveChangesAsync();

        // Act
        await _sut.CheckAndGrantAchievementsAsync(userId);

        // Assert
        var userAchievement = await _context.UserAchievements.FirstOrDefaultAsync(ua =>
            ua.UserId == userId && ua.AchievementId == achievement.Id
        );
        userAchievement.ShouldNotBeNull();
    }

    [Fact]
    public async Task CheckAndGrantAchievementsAsync_GrantsFirstReframe_WhenUserHasReframedThought()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var achievement = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = "first-reframe",
            Title = "First Reframe",
            Description = "First",
            Points = 10,
        };
        _context.Achievements.Add(achievement);
        _context.Checkins.Add(
            new Checkin
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                MoodLabel = "Happy",
                PromptQuestion = "How are you?",
                ReframedThought = "reframed",
            }
        );
        await _context.SaveChangesAsync();

        // Act
        await _sut.CheckAndGrantAchievementsAsync(userId);

        // Assert
        var userAchievement = await _context.UserAchievements.FirstOrDefaultAsync(ua =>
            ua.UserId == userId && ua.AchievementId == achievement.Id
        );
        userAchievement.ShouldNotBeNull();
    }

    [Fact]
    public async Task CheckAndGrantAchievementsAsync_GrantsActivityAchievements()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var achievement = new Achievement
        {
            Id = Guid.NewGuid().ToString(),
            Slug = "first-activity",
            Title = "First Activity",
            Description = "First",
            Points = 10,
        };
        _context.Achievements.Add(achievement);
        _context.ScheduledActivities.Add(
            new ScheduledActivity
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                Title = "Activity",
                Completed = true,
            }
        );
        await _context.SaveChangesAsync();

        // Act
        await _sut.CheckAndGrantAchievementsAsync(userId);

        // Assert
        var userAchievement = await _context.UserAchievements.FirstOrDefaultAsync(ua =>
            ua.UserId == userId && ua.AchievementId == achievement.Id
        );
        userAchievement.ShouldNotBeNull();
    }
}
