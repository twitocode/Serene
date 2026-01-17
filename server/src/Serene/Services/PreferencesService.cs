using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Services;

public interface IPreferencesService
{
    Task<PreferencesResponse> GetUserPreferencesAsync(string userId);
    Task<PreferencesResponse> UpdatePreferencesAsync(string userId, UpdatePreferencesDto dto);
}

public class PreferencesService : IPreferencesService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PreferencesService> _logger;
    private readonly HybridCache _cache;

    public PreferencesService(ApplicationDbContext context, ILogger<PreferencesService> logger, HybridCache cache = null)
    {
        _context = context;
        _logger = logger;
        _cache = cache;
    }

    public async Task<PreferencesResponse> GetUserPreferencesAsync(string userId)
    {
        _logger.LogInformation("Fetching preferences for user: {UserId}", userId);

        var prefs = await _context.Preferences
            .Where(x => x.UserId == userId)
            .Select(x => new PreferencesResponse
            {
                PasswordLock = x.PasswordLock,
                Theme = x.Theme,
            })
            .FirstOrDefaultAsync();

        if (prefs == null)
        {
            _logger.LogInformation("Creating default preferences for user: {UserId}", userId);

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                _logger.LogError("User {id} is supposed to exist but does not", userId);
                throw new KeyNotFoundException("User profile not found");
            }

            var newPrefs = new Preferences
            {
                PasswordLock = null,
                Theme = "Light",
                UserId = userId
            };

            _context.Preferences.Add(newPrefs);
            await _context.SaveChangesAsync();

            prefs = new PreferencesResponse
            {
                Theme = newPrefs.Theme,
                PasswordLock = newPrefs.PasswordLock
            };
        }

        return prefs;
    }

    public async Task<PreferencesResponse> UpdatePreferencesAsync(string userId, UpdatePreferencesDto dto)
    {
        _logger.LogInformation("Updating preferences for user: {UserId}", userId);

        using var transaction = _context.Database.BeginTransaction();

        try
        {
            var user = await _context.Users
                .Include(u => u.Preferences)
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new KeyNotFoundException("User not found");

            if (user.Preferences == null)
            {
                _logger.LogInformation("Creating new preferences record for user: {UserId}", userId);
                user.Preferences = new Preferences { UserId = userId };
                _context.Preferences.Add(user.Preferences);
            }

            if (dto.Theme != null)
            {
                _logger.LogInformation("User {UserId} changed theme to {Theme}", userId, dto.Theme);
                user.Preferences.Theme = dto.Theme;
            }

            if (dto.PasswordLock != null)
            {
                _logger.LogInformation("User {UserId} updated password lock setting", userId);
                user.Preferences.PasswordLock = dto.PasswordLock;
            }

            await _context.SaveChangesAsync();
            await _cache.RemoveByTagAsync($"profile-{userId}");

            return new PreferencesResponse
            {
                Id = user.Preferences.Id,
                Theme = user.Preferences.Theme,
                PasswordLock = user.Preferences.PasswordLock,
                UserId = user.Preferences.UserId,
                CreatedAt = user.Preferences.CreatedAt,
                UpdatedAt = user.Preferences.UpdatedAt
            };
        }
        catch { throw; }

    }
}