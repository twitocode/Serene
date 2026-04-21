using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Services;
using Shouldly;
using Xunit;

namespace Serene.Tests.Services;

public class StreakServiceTests
{
    private static readonly Faker Faker = new Faker();
    private readonly ApplicationDbContext _context;
    private readonly ILogger<StreakService> _logger;
    private readonly StreakService _sut;
    private readonly DateTimeZone _zone;

    public StreakServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _logger = Substitute.For<ILogger<StreakService>>();
        _sut = new StreakService(_context, _logger);
        _zone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
    }

    [Fact]
    public async Task UpdateStreakAsync_WhenNoCheckins_SetsStreakToZero()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        _context.Profiles.Add(new Profile { UserId = userId, CurrentStreak = 5 });
        await _context.SaveChangesAsync();

        // Act
        await _sut.UpdateStreakAsync(userId);

        // Assert
        var profile = await _context.Profiles.FirstAsync(p => p.UserId == userId);
        profile.CurrentStreak.ShouldBe(0);
    }

    [Fact]
    public async Task UpdateStreakAsync_WhenCheckedInToday_IncrementsStreak()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var now = SystemClock.Instance.GetCurrentInstant();
        var today = now.InZone(_zone).Date;

        _context.Profiles.Add(new Profile { UserId = userId, CurrentStreak = 0 });
        _context.Checkins.Add(new Checkin { UserId = userId, DateCompleted = now });
        await _context.SaveChangesAsync();

        // Act
        await _sut.UpdateStreakAsync(userId);

        // Assert
        var profile = await _context.Profiles.FirstAsync(p => p.UserId == userId);
        profile.CurrentStreak.ShouldBe(1);
    }

    [Fact]
    public async Task UpdateStreakAsync_WhenCheckedInTodayAndYesterday_ContinuesStreak()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var now = SystemClock.Instance.GetCurrentInstant();
        var today = now.InZone(_zone).Date;
        var yesterday = today.PlusDays(-1);

        // Convert dates back to instants at start of day in the same zone
        var todayInstant = today.AtStartOfDayInZone(_zone).ToInstant();
        var yesterdayInstant = yesterday.AtStartOfDayInZone(_zone).ToInstant();

        _context.Profiles.Add(new Profile { UserId = userId, CurrentStreak = 0 });
        _context.Checkins.AddRange(
            new Checkin { UserId = userId, DateCompleted = todayInstant },
            new Checkin { UserId = userId, DateCompleted = yesterdayInstant }
        );
        await _context.SaveChangesAsync();

        // Act
        await _sut.UpdateStreakAsync(userId);

        // Assert
        var profile = await _context.Profiles.FirstAsync(p => p.UserId == userId);
        profile.CurrentStreak.ShouldBe(2);
    }

    [Fact]
    public async Task UpdateStreakAsync_WhenGapInCheckins_ResetsStreak()
    {
        // Arrange
        var userId = Faker.Random.Guid().ToString();
        var now = SystemClock.Instance.GetCurrentInstant();
        var today = now.InZone(_zone).Date;
        var dayBeforeYesterday = today.PlusDays(-2);

        var todayInstant = today.AtStartOfDayInZone(_zone).ToInstant();
        var dayBeforeYesterdayInstant = dayBeforeYesterday.AtStartOfDayInZone(_zone).ToInstant();

        _context.Profiles.Add(new Profile { UserId = userId, CurrentStreak = 0 });
        _context.Checkins.AddRange(
            new Checkin { UserId = userId, DateCompleted = todayInstant },
            new Checkin { UserId = userId, DateCompleted = dayBeforeYesterdayInstant }
        );
        await _context.SaveChangesAsync();

        // Act
        await _sut.UpdateStreakAsync(userId);

        // Assert
        var profile = await _context.Profiles.FirstAsync(p => p.UserId == userId);
        profile.CurrentStreak.ShouldBe(1); // Only today counts, yesterday was missed
    }
}
