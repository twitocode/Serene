using Bogus;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NSubstitute;
using Serene.Configuration;
using Serene.Data;
using Serene.Entities;
using Serene.Features.AI;
using Serene.Features.Explore;
using Shouldly;

namespace Serene.Tests.Features.Explore;

public class ExploreServiceTests : IDisposable
{
    private readonly TestApplicationDbContext _context;
    private readonly IEmbeddingService _embeddingService;
    private readonly ILogger<ExploreService> _logger;
    private readonly HybridCache _cache;
    private readonly IOptions<SerperOptions> _serperOptions;
    private readonly ExploreService _sut;
    private readonly string _userId = Guid.NewGuid().ToString();
    private static readonly Faker Faker = new Faker();

    public ExploreServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new TestApplicationDbContext(options);
        _embeddingService = Substitute.For<IEmbeddingService>();
        _logger = Substitute.For<ILogger<ExploreService>>();
        _cache = Substitute.For<HybridCache>();
        _serperOptions = Options.Create(new SerperOptions { ApiKey = "fake-key" });
        _sut = new ExploreService(_context, _embeddingService, _logger, _cache, _serperOptions);
    }

    [Fact]
    public async Task GetAllContentAsync_ShouldReturnAllContent()
    {
        // Arrange
        var content = new ExploreContent
        {
            Title = "Article 1",
            Url = "https://example.com/1",
            Type = ExploreContentType.Article,
        };
        _context.ExploreContent.Add(content);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetAllContentAsync();

        // Assert
        result.Count.ShouldBe(1);
        result[0].Title.ShouldBe("Article 1");
    }

    [Fact]
    public async Task GetSchoolResourcesAsync_ShouldReturnContentForSpecificSchool()
    {
        // Arrange
        var schoolId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = _userId,
            Profile = new Profile { SchoolId = schoolId },
        };
        _context.Users.Add(user);

        var schoolContent = new ExploreContent
        {
            Title = "School Content",
            Url = "url1",
            SchoolId = schoolId,
        };
        var otherContent = new ExploreContent
        {
            Title = "Other Content",
            Url = "url2",
            SchoolId = "other",
        };
        _context.ExploreContent.AddRange(schoolContent, otherContent);
        await _context.SaveChangesAsync();

        // Act
        var result = await _sut.GetSchoolResourcesAsync(_userId);

        // Assert
        result.Count.ShouldBe(1);
        result[0].Title.ShouldBe("School Content");
    }

    [Fact]
    public async Task AddContentAsync_ShouldCreateContentWithEmbedding()
    {
        // Arrange
        var request = new CreateExploreContentRequest
        {
            Title = "New Video",
            Description = "A great video",
            Url = "https://youtube.com/v1",
            Type = "Video",
        };
        // Mocking IEmbeddingService to return a non-null vector if possible,
        // but since we ignore Embedding in TestApplicationDbContext, it won't be saved anyway.

        // Act
        var result = await _sut.AddContentAsync(request);

        // Assert
        result.ShouldNotBeNull();
        var dbContent = await _context.ExploreContent.FindAsync(result);
        dbContent.ShouldNotBeNull();
        dbContent.Title.ShouldBe("New Video");
        dbContent.Type.ShouldBe(ExploreContentType.Video);
    }

    [Fact]
    public async Task UpdateContentAsync_ShouldUpdateFields()
    {
        // Arrange
        var content = new ExploreContent { Title = "Old", Url = "old-url" };
        _context.ExploreContent.Add(content);
        await _context.SaveChangesAsync();

        var request = new CreateExploreContentRequest
        {
            Title = "New Title",
            Url = "new-url",
            Type = "Article",
        };

        // Act
        await _sut.UpdateContentAsync(content.Id, request);

        // Assert
        var dbContent = await _context.ExploreContent.FindAsync(content.Id);
        dbContent.Title.ShouldBe("New Title");
        dbContent.Url.ShouldBe("new-url");
    }

    [Fact]
    public async Task DeleteContentAsync_ShouldRemoveContent()
    {
        // Arrange
        var content = new ExploreContent { Title = "Delete Me", Url = "del" };
        _context.ExploreContent.Add(content);
        await _context.SaveChangesAsync();

        // Act
        await _sut.DeleteContentAsync(content.Id);

        // Assert
        var dbContent = await _context.ExploreContent.FindAsync(content.Id);
        dbContent.ShouldBeNull();
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
