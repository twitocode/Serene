using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Community;
using Shouldly;

namespace Serene.Tests.Features.Community;

public class PeerMatchServiceTests : IDisposable
{
    private readonly TestApplicationDbContext _context;
    private readonly ILogger<PeerMatchService> _logger;
    private readonly PeerMatchService _sut;
    private readonly string _userId = Guid.NewGuid().ToString();
    private static readonly Faker Faker = new Faker();

    public PeerMatchServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _logger = Substitute.For<ILogger<PeerMatchService>>();
        _sut = new PeerMatchService(_context, _logger);
    }

    [Fact]
    public async Task UpdateInterestsAsync_ShouldReplaceExistingInterests()
    {
        // Arrange
        var existing = new UserInterest { UserId = _userId, Interest = "Old" };
        _context.UserInterests.Add(existing);
        await _context.SaveChangesAsync();

        var newInterests = new List<string> { "Music", "Coding" };

        // Act
        await _sut.UpdateInterestsAsync(_userId, newInterests);

        // Assert
        var result = await _context.UserInterests.Where(x => x.UserId == _userId).ToListAsync();
        result.Count.ShouldBe(2);
        result.ShouldContain(x => x.Interest == "Music");
        result.ShouldContain(x => x.Interest == "Coding");
    }

    [Fact]
    public async Task GetCurrentMatchAsync_WhenMatchExists_ShouldReturnIt()
    {
        // Arrange
        var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        var partnerId = Guid.NewGuid().ToString();
        var match = new PeerMatch
        {
            UserId = _userId,
            MatchedUserId = partnerId,
            SharedInterest = "Gaming",
            MatchDate = today,
            IsActive = true,
        };
        _context.PeerMatches.Add(match);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetCurrentMatchAsync(_userId);

        // Assert
        result.ShouldNotBeNull();
        result.MatchId.ShouldBe(match.Id);
        result.SharedInterest.ShouldBe("Gaming");
        result.AnonymousName.ShouldNotBeNullOrEmpty();
    }

    [Fact]
    public async Task GetCurrentMatchAsync_WhenNoMatchExists_ShouldCreateNewMatch()
    {
        // Arrange
        var partnerId = Guid.NewGuid().ToString();
        _context.UserInterests.Add(new UserInterest { UserId = _userId, Interest = "Art" });
        _context.UserInterests.Add(new UserInterest { UserId = partnerId, Interest = "Art" });
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetCurrentMatchAsync(_userId);

        // Assert
        result.ShouldNotBeNull();
        result.SharedInterest.ShouldBe("Art");

        var dbMatch = await _context.PeerMatches.FirstOrDefaultAsync(m =>
            m.UserId == _userId || m.MatchedUserId == _userId
        );
        dbMatch.ShouldNotBeNull();
        dbMatch.SharedInterest.ShouldBe("Art");
    }

    [Fact]
    public async Task GetCurrentMatchAsync_WhenNoCommonInterests_ShouldReturnNull()
    {
        // Arrange
        var partnerId = Guid.NewGuid().ToString();
        _context.UserInterests.Add(new UserInterest { UserId = _userId, Interest = "Art" });
        _context.UserInterests.Add(new UserInterest { UserId = partnerId, Interest = "Science" });
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetCurrentMatchAsync(_userId);

        // Assert
        result.ShouldBeNull();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
