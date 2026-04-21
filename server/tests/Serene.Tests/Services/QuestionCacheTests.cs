using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using NodaTime;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Services;
using Shouldly;
using Xunit;

namespace Serene.Tests.Services;

public class QuestionCacheTests
{
    private readonly IMemoryCache _cache;
    private readonly ApplicationDbContext _context;
    private readonly QuestionCache _sut;

    public QuestionCacheTests()
    {
        _cache = Substitute.For<IMemoryCache>();
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _sut = new QuestionCache(_cache, _context);
    }

    [Fact]
    public async Task GetQuestionAsync_WhenInCache_ReturnsFromCache()
    {
        // Arrange
        var date = new LocalDate(2024, 1, 1);
        var question = new QuestionOfTheDay
        {
            Id = Guid.NewGuid().ToString(),
            Question = "Cached?",
            Day = date,
        };
        object? cachedValue = question;
        _cache
            .TryGetValue(Arg.Any<string>(), out Arg.Any<object?>())
            .Returns(x =>
            {
                x[1] = cachedValue;
                return true;
            });

        // Act
        var result = await _sut.GetQuestionAsync(date);

        // Assert
        result.ShouldBe(question);
        _cache.Received(1).TryGetValue($"qotd:{date}", out Arg.Any<object?>());
    }

    [Fact]
    public async Task GetQuestionAsync_WhenNotInCache_ReturnsFromDbAndSetsCache()
    {
        // Arrange
        var date = new LocalDate(2024, 1, 1);
        var question = new QuestionOfTheDay
        {
            Id = Guid.NewGuid().ToString(),
            Question = "In DB",
            Day = date,
        };
        _context.QuestionsOfTheDay.Add(question);
        await _context.SaveChangesAsync();

        _cache.TryGetValue(Arg.Any<string>(), out Arg.Any<object?>()).Returns(false);

        // Act
        var result = await _sut.GetQuestionAsync(date);

        // Assert
        result.ShouldNotBeNull();
        result.Question.ShouldBe("In DB");
        _cache.Received().CreateEntry($"qotd:{date}");
    }

    [Fact]
    public void SetQuestion_SetsCacheWithCorrectKey()
    {
        // Arrange
        var date = new LocalDate(2024, 1, 1);
        var question = new QuestionOfTheDay
        {
            Id = Guid.NewGuid().ToString(),
            Question = "Set",
            Day = date,
        };

        // Act
        _sut.SetQuestion(date, question);

        // Assert
        _cache.Received().CreateEntry($"qotd:{date}");
    }

    [Fact]
    public void Invalidate_RemovesFromCache()
    {
        // Arrange
        var date = new LocalDate(2024, 1, 1);

        // Act
        _sut.Invalidate(date);

        // Assert
        _cache.Received().Remove($"qotd:{date}");
    }
}
