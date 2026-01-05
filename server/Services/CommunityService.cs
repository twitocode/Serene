using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using NodaTime.Text;
using Serene.Common;
using Serene.Controllers;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Services;

public interface ICommunityService
{
    Task AnswerQOTDAsync(QOTDPostRequest dto);
    Task<List<PostResponse>> GetResponsesAsync(string? date);
    Task<QOTDResponse?> GetQOTDAsync(string? date);
    Task<QuestionOfTheDay?> CreateNewQOTD();
}

public class CommunityService : ICommunityService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UsersService> _logger;
    private readonly IGeminiService _geminiService;

    public CommunityService(ApplicationDbContext context, ILogger<UsersService> logger, IGeminiService geminiService)
    {
        _context = context;
        _logger = logger;
        _geminiService = geminiService;
    }

    public async Task AnswerQOTDAsync(QOTDPostRequest dto)
    {
        throw new NotImplementedException();
    }

    public async Task<QuestionOfTheDay?> CreateNewQOTD()
    {
        LocalDate today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        Instant todayStart = today.AtMidnight().InUtc().ToInstant();
        Instant tomorrowStart = todayStart.Plus(Duration.FromDays(1));

        var existingQotd = await _context.QuestionsOfTheDay
            .FirstOrDefaultAsync(x => x.CreatedAt >= todayStart && x.CreatedAt < tomorrowStart);

        if (existingQotd != null)
        {
            _logger.LogInformation("QOTD already exists today");
            return existingQotd;
        }


        string question = await _geminiService.GetDailyQuestionAsync();

        //TODO: add error handling
        var qotd = new QuestionOfTheDay
        {
            Question = question
        };
        _context.Add(qotd);
        await _context.SaveChangesAsync();
        _logger.LogInformation("QOTD added");
        return qotd;
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
                throw new AppException("Invalid date format. Please use yyyy-MM-dd", ErrorCodes.InvalidInput);
            }
            targetDate = parseResult.Value;
        }

        Instant start = targetDate.AtMidnight().InUtc().ToInstant();
        Instant end = start.Plus(Duration.FromDays(1));

        var qotd = await _context.QuestionsOfTheDay
            .FirstOrDefaultAsync(x => x.CreatedAt >= start && x.CreatedAt < end);

        if (qotd == null && targetDate == today)
        {
             qotd = await CreateNewQOTD();
        }

        if (qotd != null)
        {
            return new QOTDResponse
            {
                QOTDId = qotd.Id,
                Question = qotd.Question,
            };
        }

        throw new Exception("A question of the day is supposed to exist but does not");
    }

    public async Task<List<PostResponse>> GetResponsesAsync(string? date)
    {
        throw new NotImplementedException();
    }
}
