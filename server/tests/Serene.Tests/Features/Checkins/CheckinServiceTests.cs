using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Serene.Common;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Checkins;
using Serene.Services;
using Shouldly;

namespace Serene.Tests.Features.Checkins;

public class CheckinServiceTests : IDisposable
{
    private readonly TestApplicationDbContext _context;
    private readonly ILogger<CheckinService> _logger;
    private readonly IEncryptionService _encryption;
    private readonly IStreakService _streakService;
    private readonly IAchievementService _achievementService;
    private readonly CheckinService _sut;
    private readonly string _userId = Guid.NewGuid().ToString();
    private static readonly Faker Faker = new Faker();

    public CheckinServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _logger = Substitute.For<ILogger<CheckinService>>();
        _encryption = Substitute.For<IEncryptionService>();
        _streakService = Substitute.For<IStreakService>();
        _achievementService = Substitute.For<IAchievementService>();
        _sut = new CheckinService(
            _context,
            _logger,
            _encryption,
            _streakService,
            _achievementService
        );

        // Default encryption mock
        _encryption
            .Encrypt(Arg.Any<string>())
            .Returns(x => x.Arg<string>() == null ? null : x.Arg<string>() + "_encrypted");
        _encryption
            .Decrypt(Arg.Any<string>())
            .Returns(x => x.Arg<string>()?.Replace("_encrypted", ""));
        _encryption.EncryptJson(Arg.Any<object>()).Returns("json_encrypted");
    }

    [Fact]
    public async Task GetCheckinAsync_ShouldReturnDecryptedCheckins()
    {
        // Arrange
        var checkin = new Checkin
        {
            UserId = _userId,
            MoodLabel = "Happy_encrypted",
            MoodSeverity = 8,
            PromptQuestion = "How are you?",
            PromptAnswer = "Good_encrypted",
            LingeringThoughts = "None_encrypted",
            ReframedThought = "Better_encrypted",
            SomaticStateEncrypted = "json_encrypted",
            DateCompleted = SystemClock.Instance.GetCurrentInstant(),
        };
        _context.Checkins.Add(checkin);
        await _context.SaveChangesAsync();

        var somaticState = new Dictionary<string, GridPoint>
        {
            {
                "head",
                new GridPoint { X = 0.5f, Y = 0.5f }
            },
        };
        _encryption
            .DecryptJson<Dictionary<string, GridPoint>>("json_encrypted")
            .Returns(somaticState);

        // Act
        var result = await _sut.GetCheckinAsync(_userId, null);

        // Assert
        result.Count.ShouldBe(1);
        result[0].MoodLabel.ShouldBe("Happy");
        result[0].PromptAnswer.ShouldBe("Good");
        result[0].LingeringThoughts.ShouldBe("None");
        result[0].ReframedThought.ShouldBe("Better");
        result[0].SomaticState.ShouldBe(somaticState);
    }

    [Fact]
    public async Task CompleteCheckinAsync_ShouldCreateEncryptedCheckinAndUpdateStreak()
    {
        // Arrange
        var user = new User { Id = _userId, UserName = Faker.Internet.UserName() };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var request = new CompleteCheckinRequest
        {
            MoodLabel = "Sad",
            MoodSeverity = 3,
            PromptQuestion = "What's wrong?",
            PromptAnswer = "Stress",
            LingeringThoughts = "Work",
            ReframedThought = "It will pass",
            SomaticState = new Dictionary<string, GridPoint>(),
        };

        // Act
        await _sut.CompleteCheckinAsync(_userId, null, request);

        // Assert
        var dbCheckin = await _context.Checkins.FirstOrDefaultAsync(c => c.UserId == _userId);
        dbCheckin.ShouldNotBeNull();
        dbCheckin.MoodLabel.ShouldBe("Sad_encrypted");
        dbCheckin.PromptAnswer.ShouldBe("Stress_encrypted");
        dbCheckin.SomaticStateEncrypted.ShouldBe("json_encrypted");

        await _streakService.Received(1).UpdateStreakAsync(_userId, Arg.Any<LocalDate>());
        await _achievementService.Received(1).CheckAndGrantAchievementsAsync(_userId);
    }

    [Fact]
    public async Task CompleteCheckinAsync_WithNonExistentUser_ShouldThrowAppException()
    {
        // Act & Assert
        await Should.ThrowAsync<AppException>(() =>
            _sut.CompleteCheckinAsync(
                "invalid-user",
                null,
                new CompleteCheckinRequest { MoodLabel = "Happy", MoodSeverity = 5 }
            )
        );
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
