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
    private const string ModelName = "qwen/qwen3-embedding-8b";

    public EmbeddingService(IConfiguration configuration)
    {
        var apiKey = configuration["OPENROUTER_API_KEY"]
                    ?? throw new ArgumentException("OPENROUTER_API_KEY not found in environment");

        var options = new OpenAIClientOptions
        {
            Endpoint = new Uri("https://openrouter.ai/api/v1")
        };

        // Create the main client then get the embedding client
        var client = new OpenAIClient(new ApiKeyCredential(apiKey), options);
        _client = client.GetEmbeddingClient(ModelName);
    }

    public async Task<Vector> GetEmbeddingAsync(string text)
    {
        var options = new EmbeddingGenerationOptions
        {
            Dimensions = 1024
        };

        var response = await _client.GenerateEmbeddingAsync(text, options);
        var embedding = response.Value.ToFloats();

        return new Vector(embedding);
    }
}