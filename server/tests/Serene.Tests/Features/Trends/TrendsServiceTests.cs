using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Trends;
using Serene.Services;
using Shouldly;

namespace Serene.Tests.Features.Trends;

public class TrendsServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TrendsService> _logger;
    private readonly IEncryptionService _encryption;
    private readonly TrendsService _sut;
    private readonly Faker _faker = new Faker();

    public TrendsServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _logger = Substitute.For<ILogger<TrendsService>>();
        _encryption = Substitute.For<IEncryptionService>();
        _sut = new TrendsService(_context, _logger, _encryption);

        // Default decryption returns the input
        _encryption.Decrypt(Arg.Any<string>()).Returns(x => x.Arg<string>());
    }

    [Fact]
    public async Task GetTrendsAsync_ReturnsCorrectStatistics()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var year = 2024;
        var zone = DateTimeZoneProviders.Tzdb.GetSystemDefault();

        // Create checkins for this year
        var checkin1 = new Serene.Entities.Checkin
        {
            UserId = userId,
            MoodLabel = "Happy",
            MoodSeverity = 8,
            PromptQuestion = "Exercise",
            DateCompleted = new LocalDate(year, 6, 15).AtStartOfDayInZone(zone).ToInstant(),
            SomaticStateEncrypted = "encrypted_json",
        };

        var checkin2 = new Serene.Entities.Checkin
        {
            UserId = userId,
            MoodLabel = "Anxious",
            MoodSeverity = 4,
            PromptQuestion = "Work",
            DateCompleted = new LocalDate(year, 7, 20).AtStartOfDayInZone(zone).ToInstant(),
        };

        // Create checkin for previous year
        var prevCheckin = new Serene.Entities.Checkin
        {
            UserId = userId,
            MoodLabel = "Neutral",
            MoodSeverity = 5,
            DateCompleted = new LocalDate(year - 1, 10, 10).AtStartOfDayInZone(zone).ToInstant(),
        };

        _context.Checkins.AddRange(checkin1, checkin2, prevCheckin);

        // Somatic state mock
        var somaticState = new Dictionary<string, Serene.Entities.GridPoint>
        {
            ["Head"] = new Serene.Entities.GridPoint { Sensations = ["Tension"] },
        };
        _encryption
            .DecryptJson<Dictionary<string, Serene.Entities.GridPoint>>(
                checkin1.SomaticStateEncrypted
            )
            .Returns(somaticState);

        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetTrendsAsync(userId, year);

        // Assert
        result.Year.ShouldBe(year);
        result.MoodBreakdown.ThisYear.Count.ShouldBe(2);
        result.MoodBreakdown.PreviousYear.Count.ShouldBe(1);

        result.MoodBreakdown.ThisYear.ShouldContain(m => m.MoodLabel == "Happy" && m.Count == 1);
        result.MoodBreakdown.ThisYear.ShouldContain(m => m.MoodLabel == "Anxious" && m.Count == 1);
        result.MoodBreakdown.PreviousYear.ShouldContain(m =>
            m.MoodLabel == "Neutral" && m.Count == 1
        );

        result.TopActivities.Count.ShouldBe(2);
        result.TopActivities.ShouldContain(a => a.Activity == "Exercise");

        result.SomaticData.PartCounts.ShouldContainKey("Head");
        result.SomaticData.TopSensations.ShouldContain(s => s.Sensation == "Tension");

        result.EnergyLevels.Count.ShouldBe(12);
        result.EnergyLevels.First(e => e.Month == 6).AverageLevel.ShouldBe(8);
        result.EnergyLevels.First(e => e.Month == 7).AverageLevel.ShouldBe(4);
    }

    [Fact]
    public async Task GetTrendsAsync_WhenNoData_ReturnsEmptyStats()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var year = 2024;

        // Act
        var result = await _sut.GetTrendsAsync(userId, year);

        // Assert
        result.MoodBreakdown.ThisYear.ShouldBeEmpty();
        result.MoodBreakdown.PreviousYear.ShouldBeEmpty();
        result.TopActivities.ShouldBeEmpty();
        result.EnergyLevels.ShouldAllBe(e => e.AverageLevel == 0);
    }
}
