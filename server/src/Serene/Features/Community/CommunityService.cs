using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using NodaTime;
using NodaTime.Text;
using Serene.Common;
using Serene.Data;
using Serene.Entities;
using Serene.Services;

namespace Serene.Features.Community;

public interface ICommunityService
{
    Task AnswerQOTDAsync(QOTDPostRequest dto, string uid);
    Task<List<PostResponse>> GetResponsesAsync(string? date);
    Task<QOTDResponse?> GetQOTDAsync(string? date);
    Task<QuestionOfTheDay?> CreateNewQOTD();
}

public class CommunityService : ICommunityService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CommunityService> _logger;
    private readonly IQuestionPreparationService _preparationService;
    private readonly IQuestionCache _qotdCache;
    private readonly HybridCache _cache;

    public CommunityService(
        ApplicationDbContext context,
        ILogger<CommunityService> logger,
        IQuestionPreparationService preparationService,
        IQuestionCache qotdCache,
        HybridCache cache
    )
    {
        _context = context;
        _logger = logger;
        _preparationService = preparationService;
        _qotdCache = qotdCache;
        _cache = cache;
    }

    public async Task AnswerQOTDAsync(QOTDPostRequest dto, string uid)
    {
        var qotd = await _context.QuestionsOfTheDay.FindAsync(dto.QOTDId);
        if (qotd == null)
        {
            throw new AppException("Question not found", ErrorCodes.NotFound);
        }

        var alreadyPosted = await _context.Posts.AnyAsync(x =>
            x.UserId == uid && x.QotdId == dto.QOTDId
        );
        if (alreadyPosted)
        {
            throw new AppException(
                "You already responded to this question",
                ErrorCodes.InvalidCredentials
            );
        }

        var response = new Post
        {
            UserId = uid,
            Answer = dto.Response!,
            QotdId = dto.QOTDId,
        };

        _context.Posts.Add(response);
        _logger.LogInformation("User {uid} responded to QOTD {qotdId}", uid, dto.QOTDId);

        await _context.SaveChangesAsync();

        var cacheKey = $"community-responses-{qotd.Day:yyyy-MM-dd}";
        await _cache.RemoveAsync(cacheKey);
    }

    public async Task<QuestionOfTheDay?> CreateNewQOTD()
    {
        LocalDate today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        await _preparationService.PrepareEmergencyQuestionAsync(today);
        return await _qotdCache.GetQuestionAsync(today);
    }

    public async Task<QOTDResponse?> GetQOTDAsync(string? date)
    {
        LocalDate targetDate;
        LocalDate today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;

        if (string.IsNullOrWhiteSpace(date))
        {
            targetDate = today;
        }
        else
        {
            var parseResult = LocalDatePattern.Iso.Parse(date);
            if (!parseResult.Success)
            {
                _logger.LogError("Invalid date format provided in query string: {date}", date);
                throw new AppException(
                    "Invalid date format. Please use yyyy-MM-dd",
                    ErrorCodes.InvalidInput
                );
            }
            targetDate = parseResult.Value;
        }

        var qotd = await _qotdCache.GetQuestionAsync(targetDate);

        if (qotd == null && targetDate == today)
        {
            await _preparationService.PrepareEmergencyQuestionAsync(today);
            qotd = await _qotdCache.GetQuestionAsync(today);
        }

        if (qotd != null)
        {
            return new QOTDResponse { QOTDId = qotd.Id, Question = qotd.Question };
        }

        return null;
    }

    public async Task<List<PostResponse>> GetResponsesAsync(string? date)
    {
        LocalDate targetDate;

        if (string.IsNullOrWhiteSpace(date))
        {
            targetDate = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        }
        else
        {
            var parseResult = LocalDatePattern.Iso.Parse(date);
            if (!parseResult.Success)
            {
                _logger.LogError("Invalid date format provided in query string: {date}", date);
                throw new AppException(
                    "Invalid date format. Please use yyyy-MM-dd",
                    ErrorCodes.InvalidInput
                );
            }
            targetDate = parseResult.Value;
        }

        var cacheKey = $"community-responses-{targetDate:yyyy-MM-dd}";

        return await _cache.GetOrCreateAsync(
            cacheKey,
            async token =>
            {
                var qotd = await _context.QuestionsOfTheDay.FirstOrDefaultAsync(
                    x => x.Day == targetDate,
                    token
                );

                if (qotd == null)
                {
                    return new List<PostResponse>();
                }

                var responses = await _context
                    .Posts.Where(x => x.QotdId == qotd.Id)
                    .Include(x => x.User)
                    .Select(x => new PostResponse
                    {
                        Answer = x.Answer,
                        UserId = x.UserId,
                        Username =
                            x.User != null && x.User.Name != null ? x.User.Name : "Anonymous",
                    })
                    .ToListAsync(token);

                return responses;
            },
            options: new HybridCacheEntryOptions
            {
                Expiration = TimeSpan.FromMinutes(5),
                LocalCacheExpiration = TimeSpan.FromMinutes(1),
            }
        );
    }
}
