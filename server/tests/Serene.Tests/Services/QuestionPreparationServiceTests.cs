using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.AI;
using Serene.Services;
using Shouldly;
using Xunit;

namespace Serene.Tests.Services;

public class QuestionPreparationServiceTests
{
    private readonly ApplicationDbContext _context;
    private readonly IAIService _aiService;
    private readonly IQuestionBankService _bankService;
    private readonly ILogger<QuestionPreparationService> _logger;
    private readonly QuestionPreparationService _sut;

    public QuestionPreparationServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _aiService = Substitute.For<IAIService>();
        _bankService = Substitute.For<IQuestionBankService>();
        _logger = Substitute.For<ILogger<QuestionPreparationService>>();
        _sut = new QuestionPreparationService(_context, _aiService, _bankService, _logger);
    }

    [Fact]
    public async Task PrepareQuestionsForRangeAsync_GeneratesMissingQuestions()
    {
        // Arrange
        var start = new LocalDate(2024, 1, 1);
        var end = new LocalDate(2024, 1, 2);
        _aiService.GetDailyQuestionAsync().Returns("AI Question");

        // Act
        await _sut.PrepareQuestionsForRangeAsync(start, end);

        // Assert
        var count = await _context.QuestionsOfTheDay.CountAsync();
        count.ShouldBe(2);
        var q1 = await _context.QuestionsOfTheDay.FirstOrDefaultAsync(q => q.Day == start);
        q1.ShouldNotBeNull();
        q1.Question.ShouldBe("AI Question");
    }

    [Fact]
    public async Task PrepareEmergencyQuestionAsync_GeneratesIfMissing()
    {
        // Arrange
        var date = new LocalDate(2024, 1, 1);
        _aiService.GetDailyQuestionAsync().Returns("Emergency Question");

        // Act
        await _sut.PrepareEmergencyQuestionAsync(date);

        // Assert
        var q = await _context.QuestionsOfTheDay.FirstOrDefaultAsync(q => q.Day == date);
        q.ShouldNotBeNull();
        q.Question.ShouldBe("Emergency Question");
    }

    [Fact]
    public async Task PrepareEmergencyQuestionAsync_DoesNotGenerateIfAlreadyExists()
    {
        // Arrange
        var date = new LocalDate(2024, 1, 1);
        _context.QuestionsOfTheDay.Add(new QuestionOfTheDay { Day = date, Question = "Existing" });
        await _context.SaveChangesAsync();

        // Act
        await _sut.PrepareEmergencyQuestionAsync(date);

        // Assert
        var q = await _context.QuestionsOfTheDay.FirstOrDefaultAsync(q => q.Day == date);
        q!.Question.ShouldBe("Existing");
        await _aiService.DidNotReceive().GetDailyQuestionAsync();
    }

    [Fact]
    public async Task GenerateForDateAsync_FallsBackToBank_WhenAiFails()
    {
        // Arrange
        var date = new LocalDate(2024, 1, 1);
        _aiService
            .GetDailyQuestionAsync()
            .Returns(Task.FromException<string>(new Exception("AI Fail")));
        _bankService
            .GetUnusedQuestionAsync()
            .Returns(new QuestionBank { Id = "bank1", Question = "Bank Question" });

        // Act
        await _sut.PrepareEmergencyQuestionAsync(date);

        // Assert
        var q = await _context.QuestionsOfTheDay.FirstOrDefaultAsync(q => q.Day == date);
        q.ShouldNotBeNull();
        q.Question.ShouldBe("Bank Question");
        q.SourceType.ShouldBe(QuestionSourceType.BankSelected);
    }
}
