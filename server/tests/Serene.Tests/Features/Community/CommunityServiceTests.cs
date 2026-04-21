using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Serene.Common;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Community;
using Serene.Services;
using Shouldly;

namespace Serene.Tests.Features.Community;

public class CommunityServiceTests : IDisposable
{
    private readonly TestApplicationDbContext _context;
    private readonly ILogger<CommunityService> _logger;
    private readonly IQuestionPreparationService _preparationService;
    private readonly IQuestionCache _qotdCache;
    private readonly HybridCache _cache;
    private readonly CommunityService _sut;
    private readonly string _userId = Guid.NewGuid().ToString();
    private static readonly Faker Faker = new Faker();

    public CommunityServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _logger = Substitute.For<ILogger<CommunityService>>();
        _preparationService = Substitute.For<IQuestionPreparationService>();
        _qotdCache = Substitute.For<IQuestionCache>();
        _cache = Substitute.For<HybridCache>();
        _sut = new CommunityService(_context, _logger, _preparationService, _qotdCache, _cache);
    }

    [Fact]
    public async Task AnswerQOTDAsync_ShouldCreatePostAndInvalidateCache()
    {
        // Arrange
        var qotd = new QuestionOfTheDay { Question = "Test?", Day = new LocalDate(2024, 1, 1) };
        _context.QuestionsOfTheDay.Add(qotd);
        await _context.SaveChangesAsync();

        var request = new QOTDPostRequest { QOTDId = qotd.Id, Response = "My Answer" };

        // Act
        await _sut.AnswerQOTDAsync(request, _userId);

        // Assert
        var post = await _context.Posts.FirstOrDefaultAsync(p =>
            p.QotdId == qotd.Id && p.UserId == _userId
        );
        post.ShouldNotBeNull();
        post.Answer.ShouldBe("My Answer");

        await _cache.Received(1).RemoveAsync(Arg.Is<string>(s => s.Contains("2024-01-01")));
    }

    [Fact]
    public async Task AnswerQOTDAsync_WhenAlreadyAnswered_ShouldThrowAppException()
    {
        // Arrange
        var qotd = new QuestionOfTheDay { Question = "Test?", Day = new LocalDate(2024, 1, 1) };
        _context.QuestionsOfTheDay.Add(qotd);
        var existingPost = new Post
        {
            UserId = _userId,
            QotdId = qotd.Id,
            Answer = "Prev",
        };
        _context.Posts.Add(existingPost);
        await _context.SaveChangesAsync();

        var request = new QOTDPostRequest { QOTDId = qotd.Id, Response = "New" };

        // Act & Assert
        await Should.ThrowAsync<AppException>(() => _sut.AnswerQOTDAsync(request, _userId));
    }

    [Fact]
    public async Task GetQOTDAsync_WhenNotFoundAndToday_ShouldPrepareEmergencyAndReturn()
    {
        // Arrange
        var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        var qotd = new QuestionOfTheDay
        {
            Id = "emergency",
            Question = "Emergency?",
            Day = today,
        };
        _qotdCache
            .GetQuestionAsync(today)
            .Returns(
                Task.FromResult<QuestionOfTheDay?>(null),
                Task.FromResult<QuestionOfTheDay?>(qotd)
            );

        // Act
        var result = await _sut.GetQOTDAsync(null);

        // Assert
        result.ShouldNotBeNull();
        result.QOTDId.ShouldBe("emergency");
        await _preparationService.Received(1).PrepareEmergencyQuestionAsync(today);
    }

    [Fact]
    public async Task GetResponsesAsync_ShouldUseCacheAndReturnResponses()
    {
        // Arrange
        var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        var qotd = new QuestionOfTheDay { Question = "Test?", Day = today };
        _context.QuestionsOfTheDay.Add(qotd);
        var user = new User { Id = _userId, Name = "Test User" };
        _context.Users.Add(user);
        var post = new Post
        {
            UserId = _userId,
            QotdId = qotd.Id,
            Answer = "My Answer",
        };
        _context.Posts.Add(post);
        await _context.SaveChangesAsync();

        // Mock HybridCache to execute the factory
        _cache
            .GetOrCreateAsync<List<PostResponse>>(
                Arg.Any<string>(),
                Arg.Any<Func<CancellationToken, ValueTask<List<PostResponse>>>>(),
                Arg.Any<HybridCacheEntryOptions>(),
                Arg.Any<IEnumerable<string>>(),
                Arg.Any<CancellationToken>()
            )
            .Returns(x =>
            {
                var factory = x.Arg<Func<CancellationToken, ValueTask<List<PostResponse>>>>();
                return factory(x.Arg<CancellationToken>());
            });

        // Act
        var result = await _sut.GetResponsesAsync(null);

        // Assert
        result.Count.ShouldBe(1);
        result[0].Answer.ShouldBe("My Answer");
        result[0].Username.ShouldBe("Test User");
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
