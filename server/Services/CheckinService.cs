using Microsoft.EntityFrameworkCore;
using NodaTime;
using NodaTime.Extensions;
using Serene.Common;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Services;

public interface ICheckinService
{
    Task<List<CheckinResponse>> GetCheckinAsync(string userId, LocalDate? date);
    Task CompleteCheckinAsync(string userId, CompleteCheckinRequest dto);
}

public class CheckinService : ICheckinService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CheckinService> _logger;

    public CheckinService(ApplicationDbContext context, ILogger<CheckinService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<CheckinResponse>> GetCheckinAsync(string userId, LocalDate? date)
    {
        _logger.LogInformation("Getting checkin status for user: {UserId}", userId);

        var query = _context.Checkins.Where(x => x.UserId == userId);

        if (date.HasValue)
        {
            var zone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
            var startOfDay = date.Value.AtStartOfDayInZone(zone).ToInstant();
            var endOfDay = date.Value.PlusDays(1).AtStartOfDayInZone(zone).ToInstant();

            query = query.Where(x => x.DateCompleted >= startOfDay && x.DateCompleted < endOfDay);
        }

        var checkins = await query
            .Select(x => new CheckinResponse
            {
                DateCompleted = x.DateCompleted ?? x.CreatedAt,
                Id = x.Id,
                LingeringThoughts = x.LingeringThoughts,
                MoodLabel = x.MoodLabel,
                PromptAnswer = x.PromptAnswer,
                PromptQuestion = x.PromptQuestion,
                SomaticState = x.SomaticState,
                MoodSeverity = x.MoodSeverity
            })
            .ToListAsync();

        return checkins;
    }

    public async Task CompleteCheckinAsync(string userId, CompleteCheckinRequest dto)
    {
        var user = await _context.Users.FindAsync(userId) ?? throw new AppException("User not found", ErrorCodes.UserNotFound);

        var checkin = new Checkin
        {
            LingeringThoughts = dto.LingeringThoughts,
            MoodLabel = dto.MoodLabel,
            MoodSeverity = dto.MoodSeverity,
            PromptAnswer = dto.PromptAnswer,
            PromptQuestion = dto.PromptQuestion,
            UserId = userId,
            SomaticState = dto.SomaticState,
            DateCompleted = SystemClock.Instance.GetCurrentInstant()
        };

        await _context.Checkins.AddAsync(checkin);
        await _context.SaveChangesAsync();
    }
}