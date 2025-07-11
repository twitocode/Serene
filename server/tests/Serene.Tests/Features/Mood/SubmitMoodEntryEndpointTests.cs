using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Moq;
using NodaTime;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features;
using Serene.API.Features.Mood.Endpoints.SubmitMoodEntry;
using Shouldly;
using Xunit;

namespace Serene.Tests.Features.Mood;

public class SubmitMoodEntryEndpointTests : IClassFixture<BaseEndpointTestFixture>
{
    private readonly SubmitMoodEntryEndpoint _endpoint;
    private readonly BaseEndpointTestFixture _fixture;
    private readonly Faker<SubmitMoodEntryRequest> _requestFaker;
    private readonly Faker<User> _userFaker;

    public SubmitMoodEntryEndpointTests(BaseEndpointTestFixture fixture)
    {
        _fixture = fixture;
        _endpoint = new SubmitMoodEntryEndpoint();
        
        _userFaker = new Faker<User>()
            .RuleFor(u => u.Id, f => f.Random.Guid())
            .RuleFor(u => u.UserName, f => f.Internet.UserName())
            .RuleFor(u => u.Email, f => f.Internet.Email());
        
        _fixture.HttpContext.Object.Items["User"] = _userFaker.Generate();
        
        _requestFaker = new Faker<SubmitMoodEntryRequest>()
            .RuleFor(r => r.OverallMood, f => "Happy")
            .RuleFor(r => r.EnergyLevel, f => "High")
            .RuleFor(r => r.BestPartOfDay, f => f.Lorem.Sentence())
            .RuleFor(r => r.WorstPartOfDay, f => f.Lorem.Sentence())
            .RuleFor(r => r.HadPhysicalOrEmotionalDiscomfort, f => f.Random.Bool());
    }

    [Fact]
    public async Task Handle_Should_CreateMoodEntry_WhenNoneExistsForToday()
    {
        // Arrange
        var user = _userFaker.Generate();
        var request = _requestFaker.Generate();
        
        _fixture.HttpContext.Setup(x => x.GetUser()).Returns(user);
        
        var dbSetMock = new Mock<DbSet<MoodEntry>>();
        _fixture.Db.Setup(x => x.MoodEntries).Returns(dbSetMock.Object);
        
        // Mock that no entry exists for today
        dbSetMock.Setup(x => x.FirstOrDefaultAsync(
            It.IsAny<System.Linq.Expressions.Expression<Func<MoodEntry, bool>>>(),
            It.IsAny<CancellationToken>()
        )).ReturnsAsync((MoodEntry?)null);

        // Act
        var result = await _endpoint.Handle(request, _fixture.HttpContext.Object, _fixture.Db.Object, CancellationToken.None);

        // Assert
        result.IsSuccess.ShouldBeTrue();
        dbSetMock.Verify(x => x.AddAsync(
            It.Is<MoodEntry>(m =>
                m.UserId == user.Id &&
                m.OverallMood.ToString() == request.OverallMood &&
                m.EnergyLevel.ToString() == request.EnergyLevel &&
                m.BestPartOfDay == request.BestPartOfDay &&
                m.WorstPartOfDay == request.WorstPartOfDay &&
                m.HadPhysicalOrEmotionalDiscomfort == request.HadPhysicalOrEmotionalDiscomfort
            ),
            It.IsAny<CancellationToken>()
        ), Times.Once);
        _fixture.Db.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_Should_ReturnBadRequest_WhenEntryExistsForToday()
    {
        // Arrange
        var user = _userFaker.Generate();
        var request = _requestFaker.Generate();
        var existingEntry = new MoodEntry
        {
            UserId = user.Id,
            CreatedAt = SystemClock.Instance.GetCurrentInstant(),
            OverallMood = MoodType.Happy,
            EnergyLevel = EnergyLevelType.High
        };
        
        _fixture.HttpContext.Setup(x => x.GetUser()).Returns(user);
        
        var dbSetMock = new Mock<DbSet<MoodEntry>>();
        _fixture.Db.Setup(x => x.MoodEntries).Returns(dbSetMock.Object);

        // Mock that an entry exists for today
        dbSetMock.Setup(x => x.FirstOrDefaultAsync(
            It.IsAny<System.Linq.Expressions.Expression<Func<MoodEntry, bool>>>(),
            It.IsAny<CancellationToken>()
        )).ReturnsAsync(existingEntry);

        // Act
        var result = await _endpoint.Handle(request, _fixture.HttpContext.Object, _fixture.Db.Object, CancellationToken.None);

        // Assert
        result.IsSuccess.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.Message.Contains("Mood entry already completed for today"));
        dbSetMock.Verify(x => x.AddAsync(It.IsAny<MoodEntry>(), It.IsAny<CancellationToken>()), Times.Never);
        _fixture.Db.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
