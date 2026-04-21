using Microsoft.EntityFrameworkCore;
using NodaTime;
using NodaTime.Extensions;
using Serene.Common;
using Serene.Data;
using Serene.Entities;
using Serene.Services;

namespace Serene.Features.Checkins;

public interface ICheckinService
{
    Task<List<CheckinResponse>> GetCheckinAsync(string userId, LocalDate? date);
    Task CompleteCheckinAsync(string userId, LocalDate? date, CompleteCheckinRequest dto);
}

public class CheckinService : ICheckinService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CheckinService> _logger;
    private readonly IEncryptionService _encryption;
    private readonly IStreakService _streakService;
    private readonly IAchievementService _achievementService;

    public CheckinService(
        ApplicationDbContext context,
        ILogger<CheckinService> logger,
        IEncryptionService encryption,
        IStreakService streakService,
        IAchievementService achievementService
    )
    {
        _context = context;
        _logger = logger;
        _encryption = encryption;
        _streakService = streakService;
        _achievementService = achievementService;
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

        var checkins = await query.ToListAsync();

        return checkins
            .Select(x => new CheckinResponse
            {
                DateCompleted = x.DateCompleted ?? x.CreatedAt,
                Id = x.Id,
                LingeringThoughts = _encryption.Decrypt(x.LingeringThoughts),
                ReframedThought = _encryption.Decrypt(x.ReframedThought),
                MoodLabel = _encryption.Decrypt(x.MoodLabel) ?? x.MoodLabel,
                PromptAnswer = _encryption.Decrypt(x.PromptAnswer),
                PromptQuestion = x.PromptQuestion, // Not encrypted - needed for display
                SomaticState =
                    _encryption.DecryptJson<Dictionary<string, GridPoint>>(x.SomaticStateEncrypted)
                    ?? x.SomaticState,
                MoodSeverity = x.MoodSeverity,
            })
            .ToList();
    }

    public async Task CompleteCheckinAsync(
        string userId,
        LocalDate? date,
        CompleteCheckinRequest dto
    )
    {
        var user =
            await _context.Users.FindAsync(userId)
            ?? throw new AppException("User not found", ErrorCodes.UserNotFound);

        var zone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
        var instant = SystemClock.Instance.GetCurrentInstant();
        if (date.HasValue)
        {
            instant = date.Value.At(new LocalTime(12, 0)).InZoneStrictly(zone).ToInstant();
        }

        // Encrypt sensitive fields before saving
        var checkin = new Checkin
        {
            LingeringThoughts = _encryption.Encrypt(dto.LingeringThoughts),
            ReframedThought = _encryption.Encrypt(dto.ReframedThought),
            MoodLabel = _encryption.Encrypt(dto.MoodLabel) ?? dto.MoodLabel,
            MoodSeverity = dto.MoodSeverity,
            PromptAnswer = _encryption.Encrypt(dto.PromptAnswer),
            PromptQuestion = dto.PromptQuestion ?? string.Empty,
            UserId = userId,
            SomaticState = null,
            SomaticStateEncrypted = _encryption.EncryptJson(dto.SomaticState),
            DateCompleted = instant,
        };

        await _context.Checkins.AddAsync(checkin);
        await _context.SaveChangesAsync();

        // Update streak after successful check-in, passing the target date
        var checkinDate = date ?? SystemClock.Instance.GetCurrentInstant().InZone(zone).Date;
        await _streakService.UpdateStreakAsync(userId, checkinDate);

        await _achievementService.CheckAndGrantAchievementsAsync(userId);

        _logger.LogInformation("Checkin completed for user {UserId} with encrypted data", userId);
    }
}
