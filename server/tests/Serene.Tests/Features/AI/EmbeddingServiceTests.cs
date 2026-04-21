using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Options;
using NSubstitute;
using Serene.Configuration;
using Serene.Features.AI;
using Shouldly;
using Xunit;

namespace Serene.Tests.Features.AI;

public class EmbeddingServiceTests
{
    private readonly IOptions<AIOptions> _options;
    private readonly HybridCache _cache;
    private readonly IDistributedCache _l2;
    private readonly EmbeddingService _sut;

    public EmbeddingServiceTests()
    {
        _options = Options.Create(new AIOptions { OpenRouterApiKey = "fake-key" });
        _cache = Substitute.For<HybridCache>();
        _l2 = Substitute.For<IDistributedCache>();
        _sut = new EmbeddingService(_options, _cache, _l2);
    }

    [Fact]
    public void Constructor_WhenApiKeyMissing_ThrowsArgumentException()
    {
        // Arrange
        var options = Options.Create(new AIOptions { OpenRouterApiKey = "" });

        // Act & Assert
        Should.Throw<ArgumentException>(() => new EmbeddingService(options, _cache, _l2));
    }

    [Fact]
    public async Task GetEmbeddingAsync_UsesCache()
    {
        // Arrange
        var queryText = "test query";
        var expectedFloats = new float[1024];
        expectedFloats[0] = 1.0f;

        _cache
            .GetOrCreateAsync<float[]>(
                Arg.Is<string>(s => s.Contains(queryText)),
                Arg.Any<Func<CancellationToken, ValueTask<float[]>>>(),
                Arg.Any<HybridCacheEntryOptions>(),
                Arg.Any<IEnumerable<string>>(),
                Arg.Any<CancellationToken>()
            )
            .Returns(new ValueTask<float[]>(expectedFloats));

        // Act
        var result = await _sut.GetEmbeddingAsync(queryText);

        // Assert
        result.ShouldNotBeNull();
    }
}
