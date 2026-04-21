using Bogus;
using Microsoft.EntityFrameworkCore;
using Serene.Data;
using Serene.Entities;
using Serene.Services;
using Shouldly;
using Xunit;

namespace Serene.Tests.Services;

public class QuestionBankServiceTests
{
    private static readonly Faker Faker = new Faker();
    private readonly ApplicationDbContext _context;
    private readonly QuestionBankService _sut;

    public QuestionBankServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _sut = new QuestionBankService(_context);
    }

    [Fact]
    public async Task GetUnusedQuestionAsync_ReturnsQuestionWithLowestUsedCount()
    {
        // Arrange
        var q1 = new QuestionBank
        {
            Id = "1",
            Question = "Q1",
            UsedCount = 5,
            IsActive = true,
        };
        var q2 = new QuestionBank
        {
            Id = "2",
            Question = "Q2",
            UsedCount = 2,
            IsActive = true,
        };
        _context.QuestionBanks.AddRange(q1, q2);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetUnusedQuestionAsync();

        // Assert
        result.ShouldNotBeNull();
        result.Id.ShouldBe(q2.Id);
    }

    [Fact]
    public async Task IncrementUsageCountAsync_IncrementsCountInDb()
    {
        // Arrange
        var q1 = new QuestionBank
        {
            Id = "1",
            Question = "Q1",
            UsedCount = 0,
            IsActive = true,
        };
        _context.QuestionBanks.Add(q1);
        await _context.SaveChangesAsync();

        // Act
        await _sut.IncrementUsageCountAsync(q1.Id);

        // Assert
        var updated = await _context.QuestionBanks.FindAsync(q1.Id);
        updated!.UsedCount.ShouldBe(1);
    }

    [Fact]
    public async Task AddQuestionAsync_AddsNewQuestionToDb()
    {
        // Arrange
        var questionText = Faker.Lorem.Sentence();
        var category = "Test";

        // Act
        await _sut.AddQuestionAsync(questionText, category);

        // Assert
        var question = await _context.QuestionBanks.FirstOrDefaultAsync(q =>
            q.Question == questionText
        );
        question.ShouldNotBeNull();
        question.Category.ShouldBe(category);
        question.IsAiGenerated.ShouldBeFalse();
    }

    [Fact]
    public async Task GetQuestionsByCategoryAsync_ReturnsFilteredQuestions()
    {
        // Arrange
        var q1 = new QuestionBank
        {
            Id = "1",
            Question = "Q1",
            Category = "A",
            IsActive = true,
        };
        var q2 = new QuestionBank
        {
            Id = "2",
            Question = "Q2",
            Category = "B",
            IsActive = true,
        };
        _context.QuestionBanks.AddRange(q1, q2);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetQuestionsByCategoryAsync("A");

        // Assert
        result.Count().ShouldBe(1);
        result.First().Id.ShouldBe(q1.Id);
    }
}
