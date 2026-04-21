using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.UserSettings;

public interface ISettingsService
{
    Task<SettingsResponse> GetSettingsAsync(string userId);
    Task<SettingsResponse> UpdateSettingsAsync(string userId, UpdateSettingsDto dto);
}

public class SettingsService : ISettingsService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<SettingsService> _logger;
    private readonly HybridCache _cache;

    public SettingsService(
        ApplicationDbContext context,
        ILogger<SettingsService> logger,
        HybridCache? cache = null
    )
    {
        _context = context;
        _logger = logger;
        _cache = cache;
    }

    public async Task<SettingsResponse> GetSettingsAsync(string userId)
    {
        _logger.LogInformation("Fetching settings for user: {UserId}", userId);

        var settings = await _context
            .Settings.Where(x => x.UserId == userId)
            .Select(x => new SettingsResponse
            {
                PasswordLock = x.PasswordLock,
                Theme = x.Theme,
                Id = x.Id,
                UserId = x.UserId,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
            })
            .FirstOrDefaultAsync();

        if (settings == null)
        {
            _logger.LogInformation("Creating default settings for user: {UserId}", userId);

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                _logger.LogError("User {id} is supposed to exist but does not", userId);
                throw new KeyNotFoundException("User profile not found");
            }

            var newSettings = new Settings
            {
                PasswordLock = null,
                Theme = "Light",
                UserId = userId,
            };

            _context.Settings.Add(newSettings);
            await _context.SaveChangesAsync();

            settings = new SettingsResponse
            {
                Id = newSettings.Id,
                Theme = newSettings.Theme,
                PasswordLock = newSettings.PasswordLock,
                UserId = newSettings.UserId,
                CreatedAt = newSettings.CreatedAt,
                UpdatedAt = newSettings.UpdatedAt,
            };
        }

        return settings;
    }

    public async Task<SettingsResponse> UpdateSettingsAsync(string userId, UpdateSettingsDto dto)
    {
        _logger.LogInformation("Updating settings for user: {UserId}", userId);

        try
        {
            var user =
                await _context
                    .Users.Include(u => u.Settings)
                    .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new KeyNotFoundException("User not found");

            if (user.Settings == null)
            {
                _logger.LogInformation("Creating new settings record for user: {UserId}", userId);
                user.Settings = new Settings { UserId = userId };
                _context.Settings.Add(user.Settings);
            }

            if (dto.Theme != null)
            {
                _logger.LogInformation("User {UserId} changed theme to {Theme}", userId, dto.Theme);
                user.Settings.Theme = dto.Theme;
            }

            if (dto.PasswordLock != null)
            {
                _logger.LogInformation("User {UserId} updated password lock setting", userId);
                user.Settings.PasswordLock = dto.PasswordLock;
            }

            await _context.SaveChangesAsync();
            await _cache.RemoveByTagAsync($"profile-{userId}");

            return new SettingsResponse
            {
                Id = user.Settings.Id,
                Theme = user.Settings.Theme,
                PasswordLock = user.Settings.PasswordLock,
                UserId = user.Settings.UserId,
                CreatedAt = user.Settings.CreatedAt,
                UpdatedAt = user.Settings.UpdatedAt,
            };
        }
        catch
        {
            throw;
        }
    }
}
