using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using NSubstitute;
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
        
        _fixture.HttpContext.Items["User"] = _userFaker.Generate();
        
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
        
        _fixture.HttpContext.GetUser().Returns(user);
        
        var dbSetMock = Substitute.For<DbSet<MoodEntry>>();
        _fixture.Db.MoodEntries.Returns(dbSetMock);
        
        // Mock that no entry exists for today
        dbSetMock.FirstOrDefaultAsync(
            Arg.Any<System.Linq.Expressions.Expression<Func<MoodEntry, bool>>>(),
            Arg.Any<CancellationToken>()
        ).Returns((MoodEntry?)null);

        // Act
        var result = await _endpoint.Handle(request, _fixture.HttpContext, _fixture.Db, CancellationToken.None);

        // Assert
        result.IsSuccess.ShouldBeTrue();
        await dbSetMock.Received(1).AddAsync(Arg.Is<MoodEntry>(m => 
            m.UserId == user.Id &&
            m.OverallMood.ToString() == request.OverallMood &&
            m.EnergyLevel.ToString() == request.EnergyLevel &&
            m.BestPartOfDay == request.BestPartOfDay &&
            m.WorstPartOfDay == request.WorstPartOfDay &&
            m.HadPhysicalOrEmotionalDiscomfort == request.HadPhysicalOrEmotionalDiscomfort
        ), Arg.Any<CancellationToken>());
        await _fixture.Db.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
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
        
        _fixture.HttpContext.GetUser().Returns(user);
        
        var dbSetMock = Substitute.For<DbSet<MoodEntry>>();
        _fixture.Db.MoodEntries.Returns(dbSetMock);

        // Mock that an entry exists for today
        dbSetMock.FirstOrDefaultAsync(
            Arg.Any<System.Linq.Expressions.Expression<Func<MoodEntry, bool>>>(),
            Arg.Any<CancellationToken>()
        ).Returns(existingEntry);

        // Act
        var result = await _endpoint.Handle(request, _fixture.HttpContext, _fixture.Db, CancellationToken.None);

        // Assert
        result.IsSuccess.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.Message.Contains("Mood entry already completed for today"));
        await dbSetMock.DidNotReceive().AddAsync(Arg.Any<MoodEntry>(), Arg.Any<CancellationToken>());
        await _fixture.Db.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }
}
