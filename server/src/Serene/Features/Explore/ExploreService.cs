using Google.Cloud.DiscoveryEngine.V1;
using HtmlAgilityPack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using NodaTime;
using Pgvector.EntityFrameworkCore;
using Serene.Configuration;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Explore;

public interface IExploreService
{
    Task<List<ExploreContentResponse>> GetRecommendationsAsync(string userId);
    Task<List<ExploreContentResponse>> GetSchoolResourcesAsync(string userId);
    Task<List<ExploreContentResponse>> GetAllContentAsync();
    Task<string> AddContentAsync(CreateExploreContentRequest request);
    Task UpdateContentAsync(string id, CreateExploreContentRequest request);
    Task DeleteContentAsync(string id);
    Task<ScrapedContentResponse> ScrapeContentAsync(string url);
    Task<int> PopulateFromSearchAsync(string query, int count);
}

public class ExploreService : IExploreService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmbeddingService _embeddingService;
    private readonly ILogger<ExploreService> _logger;
    private readonly HybridCache _cache;
    private readonly IOptions<GoogleOptions> _googleOptions;

    public ExploreService(
        ApplicationDbContext context,
        IEmbeddingService embeddingService,
        ILogger<ExploreService> logger,
        HybridCache cache,
        IOptions<GoogleOptions> googleOptions
    )
    {
        _context = context;
        _embeddingService = embeddingService;
        _logger = logger;
        _cache = cache;
        _googleOptions = googleOptions;
    }

    public async Task<List<ExploreContentResponse>> GetRecommendationsAsync(string userId)
    {
        var user =
            await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new Exception("User not found");

        var age = 0;
        if (user.DateOfBirth.HasValue)
        {
            var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
            age = Period.Between(user.DateOfBirth.Value, today, PeriodUnits.Years).Years;
        }

        var gender = user.Gender ?? "person";
        var struggles = user.Profile?.Struggles ?? new List<string>();

        var queryText = $"Resources for a {age} year old {gender}";
        if (struggles.Any())
        {
            queryText += $" struggling with {string.Join(", ", struggles)}";
        }

        _logger.LogInformation("Generating recommendations for query: {QueryText}", queryText);

        var embedding = await _embeddingService.GetEmbeddingAsync(queryText);
        var recommendations = await _cache.GetOrCreateAsync(
            $"recommendations-{embedding}",
            async token =>
            {
                return await _context
                    .ExploreContent.Where(c => c.Embedding != null)
                    .OrderBy(c => c.Embedding!.CosineDistance(embedding))
                    .Take(10)
                    .Select(c => new ExploreContentResponse
                    {
                        Id = c.Id,
                        Title = c.Title,
                        Description = c.Description,
                        Url = c.Url,
                        Type = c.Type.ToString(),
                    })
                    .ToListAsync(token);
            }
        );

        return recommendations;
    }

    public async Task<List<ExploreContentResponse>> GetAllContentAsync()
    {
        return await _context
            .ExploreContent.OrderByDescending(c => c.CreatedAt)
            .Select(c => new ExploreContentResponse
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Url = c.Url,
                Type = c.Type.ToString(),
            })
            .ToListAsync();
    }

    public async Task<List<ExploreContentResponse>> GetSchoolResourcesAsync(string userId)
    {
        var user =
            await _context.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new Exception("User not found");

        var schoolId = user.Profile?.SchoolId;
        if (string.IsNullOrEmpty(schoolId))
        {
            return new List<ExploreContentResponse>();
        }

        return await _context
            .ExploreContent.Where(c => c.SchoolId == schoolId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ExploreContentResponse
            {
                Id = c.Id,
                Title = c.Title,
                Description = c.Description,
                Url = c.Url,
                Type = c.Type.ToString(),
            })
            .ToListAsync();
    }

    public async Task<string> AddContentAsync(CreateExploreContentRequest request)
    {
        var embedding = await _embeddingService.GetEmbeddingAsync(
            $"{request.Title} {request.Description} {request.Tags}"
        );

        var content = new ExploreContent
        {
            Title = request.Title,
            Description = request.Description,
            Url = request.Url,
            Type = Enum.Parse<ExploreContentType>(request.Type, true),
            Embedding = embedding,
            SchoolId = request.SchoolId,
        };

        _context.ExploreContent.Add(content);
        await _context.SaveChangesAsync();

        return content.Id;
    }

    public async Task UpdateContentAsync(string id, CreateExploreContentRequest request)
    {
        var content =
            await _context.ExploreContent.FindAsync(id) ?? throw new Exception("Content not found");
        var embedding = await _embeddingService.GetEmbeddingAsync(
            $"{request.Title} {request.Description} {request.Tags}"
        );

        content.Title = request.Title;
        content.Description = request.Description;
        content.Url = request.Url;
        content.Type = Enum.Parse<ExploreContentType>(request.Type, true);
        content.Embedding = embedding;
        content.SchoolId = request.SchoolId;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteContentAsync(string id)
    {
        var content = await _context.ExploreContent.FindAsync(id);
        if (content != null)
        {
            _context.ExploreContent.Remove(content);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<ScrapedContentResponse> ScrapeContentAsync(string url)
    {
        var web = new HtmlWeb();
        var doc = await web.LoadFromWebAsync(url);

        var title =
            doc.DocumentNode.SelectSingleNode("//meta[@property='og:title']")
                ?.GetAttributeValue("content", "")
            ?? doc.DocumentNode.SelectSingleNode("//title")?.InnerText;

        var description =
            doc.DocumentNode.SelectSingleNode("//meta[@property='og:description']")
                ?.GetAttributeValue("content", "")
            ?? doc.DocumentNode.SelectSingleNode("//meta[@name='description']")
                ?.GetAttributeValue("content", "");

        var type = "Article";
        if (url.Contains("youtube.com") || url.Contains("youtu.be"))
            type = "Video";

        return new ScrapedContentResponse
        {
            Title = System.Net.WebUtility.HtmlDecode(title ?? "").Trim(),
            Description = System.Net.WebUtility.HtmlDecode(description ?? "").Trim(),
            Type = type,
        };
    }

    public async Task<int> PopulateFromSearchAsync(string query, int count)
    {
        var projectId = _googleOptions.Value.VertexAIProjectId;
        var location = _googleOptions.Value.VertexAILocation;
        var dataStoreId = _googleOptions.Value.DataStoreId;

        if (string.IsNullOrEmpty(projectId) || string.IsNullOrEmpty(dataStoreId))
        {
            throw new Exception("Vertex AI Search Project ID or Data Store ID is not configured.");
        }

        var client = await SearchServiceClient.CreateAsync();

        var servingConfig = ServingConfigName.FromProjectLocationDataStoreServingConfig(
            projectId,
            location,
            dataStoreId,
            "default_search"
        );

        var request = new SearchRequest
        {
            ServingConfigAsServingConfigName = servingConfig,
            Query = query,
            PageSize = Math.Min(count, 10),
            ContentSearchSpec = new SearchRequest.Types.ContentSearchSpec
            {
                ExtractiveContentSpec =
                    new SearchRequest.Types.ContentSearchSpec.Types.ExtractiveContentSpec
                    {
                        MaxExtractiveAnswerCount = 1,
                    },
            },
        };

        var response = client.Search(request);

        var addedCount = 0;
        foreach (var result in response.Take(count))
        {
            var document = result.Document;
            var uri = document.DerivedStructData.Fields.TryGetValue("link", out var linkValue)
                ? linkValue.StringValue
                : "";

            if (string.IsNullOrEmpty(uri) || await _context.ExploreContent.AnyAsync(c => c.Url == uri))
                continue;

            var title = document.DerivedStructData.Fields.TryGetValue("title", out var titleValue)
                ? titleValue.StringValue
                : "";
            var snippet = document.DerivedStructData.Fields.TryGetValue(
                "snippet",
                out var snippetValue
            )
                ? snippetValue.StringValue
                : "";

            var scraped = await ScrapeContentAsync(uri);

            await AddContentAsync(
                new CreateExploreContentRequest
                {
                    Title = string.IsNullOrEmpty(scraped.Title) ? title : scraped.Title,
                    Description = string.IsNullOrEmpty(scraped.Description)
                        ? snippet
                        : scraped.Description,
                    Url = uri,
                    Type = scraped.Type,
                    Tags = query,
                }
            );

            addedCount++;
        }

        return addedCount;
    }
}
