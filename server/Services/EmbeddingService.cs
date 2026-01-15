using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Hybrid;
using OpenAI;
using OpenAI.Embeddings;
using Pgvector;
using System.ClientModel;

namespace Serene.Services;

public interface IEmbeddingService
{
    Task<Vector> GetEmbeddingAsync(string text);
}

public class EmbeddingService : IEmbeddingService
{
    private readonly EmbeddingClient _client;
    private readonly HybridCache _cache;
    private readonly IDistributedCache _l2;
    private const string ModelName = "qwen/qwen3-embedding-8b";

    public EmbeddingService(IConfiguration configuration, HybridCache cache, IDistributedCache l2)
    {
        var apiKey = configuration["OPENROUTER_API_KEY"]
                    ?? throw new ArgumentException("OPENROUTER_API_KEY not found in environment");

        var options = new OpenAIClientOptions
        {
            Endpoint = new Uri("https://openrouter.ai/api/v1")
        };

        var client = new OpenAIClient(new ApiKeyCredential(apiKey), options);
        _client = client.GetEmbeddingClient(ModelName);
        _cache = cache;
        _l2 = l2;
    }

    public async Task<Vector> GetEmbeddingAsync(string queryText)
    {
        var options = new EmbeddingGenerationOptions
        {
            Dimensions = 1024
        };

        var embeddingFloats = await _cache.GetOrCreateAsync($"embeddings-{queryText}", async token =>
        {
            var response = await _client.GenerateEmbeddingAsync(queryText, options, token);
            return response.Value.ToFloats();
        });

        return new Vector(embeddingFloats);
    }
}