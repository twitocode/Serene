using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using NSubstitute;
using Serene.Data;
using Serene.Entities;
using Serene.Features.Schools;
using Shouldly;
using Xunit;

namespace Serene.Tests.Features.Schools;

public class SchoolServiceTests
{
    private static readonly Faker Faker = new Faker();
    private readonly ApplicationDbContext _context;
    private readonly HybridCache _cache;
    private readonly SchoolService _sut;

    public SchoolServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _cache = Substitute.For<HybridCache>();
        _sut = new SchoolService(_context, _cache);
    }

    [Fact]
    public async Task GetAllSchoolsAsync_ReturnsAllSchools()
    {
        // Arrange
        var school1 = new School { Id = Guid.NewGuid().ToString(), Name = "School 1" };
        var school2 = new School { Id = Guid.NewGuid().ToString(), Name = "School 2" };
        _context.Schools.AddRange(school1, school2);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetAllSchoolsAsync();

        // Assert
        result.Count.ShouldBe(2);
        result.ShouldContain(s => s.Id == school1.Id);
        result.ShouldContain(s => s.Id == school2.Id);
    }

    [Fact]
    public async Task InstantiateSchoolAsync_WhenSchoolExists_ReturnsExisting()
    {
        // Arrange
        var school = new School { Id = Guid.NewGuid().ToString(), Name = "Existing School" };
        _context.Schools.Add(school);
        await _context.SaveChangesAsync();
        var request = new InstantiateSchoolRequest { Name = "Existing School" };

        // Act
        var result = await _sut.InstantiateSchoolAsync(request);

        // Assert
        result.Id.ShouldBe(school.Id);
        var count = await _context.Schools.CountAsync();
        count.ShouldBe(1);
    }

    [Fact]
    public async Task InstantiateSchoolAsync_WhenSchoolDoesNotExist_CreatesNew()
    {
        // Arrange
        var request = new InstantiateSchoolRequest { Name = "New School", CountryCode = "CA" };

        // Act
        var result = await _sut.InstantiateSchoolAsync(request);

        // Assert
        result.Name.ShouldBe(request.Name);
        var school = await _context.Schools.FirstOrDefaultAsync(s => s.Name == request.Name);
        school.ShouldNotBeNull();
    }

    [Fact]
    public async Task AddSchoolClubAsync_AddsClubToDatabase()
    {
        // Arrange
        var school = new School { Id = Guid.NewGuid().ToString(), Name = "School" };
        _context.Schools.Add(school);
        await _context.SaveChangesAsync();
        var request = new CreateSchoolClubRequest
        {
            Name = "Chess Club",
            Summary = "We play chess",
        };
        var userId = Guid.NewGuid().ToString();

        // Act
        var result = await _sut.AddSchoolClubAsync(school.Id, userId, request);

        // Assert
        result.Name.ShouldBe("Chess Club");
        var club = await _context.SchoolClubs.FirstOrDefaultAsync(c => c.SchoolId == school.Id);
        club.ShouldNotBeNull();
        club.UserId.ShouldBe(userId);
    }
}
