using Microsoft.EntityFrameworkCore;
using Serene.Controllers;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Services;

public interface ICommunityService
{
    Task<UserResponse> GetUserProfileAsync(string userId);
    Task<PreferencesResponse> UpdatePreferencesAsync(string userId, UpdatePreferencesDto dto);
    Task<bool> DoesUserExistAsync(string email);
}

public class CommunityService : ICommunityService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UsersService> _logger;

    public CommunityService(ApplicationDbContext context, ILogger<UsersService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UserResponse> GetUserProfileAsync(string userId)
    {
        _logger.LogInformation("Fetching profile for user: {UserId}", userId);
        var user = await _context.Users
            .AsNoTracking()
            .Include(u => u.Profile)
                .ThenInclude(p => p!.School)
            .Include(u => u.Preferences)
            .Where(u => u.Id == userId)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Image = u.Image,
                EmailConfirmed = u.EmailConfirmed,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
                Preferences = u.Preferences != null ? new PreferencesResponse
                {
                    Id = u.Preferences.Id,
                    Theme = u.Preferences.Theme,
                    PasswordLock = u.Preferences.PasswordLock,
                    UserId = u.Preferences.UserId,
                    CreatedAt = u.Preferences.CreatedAt,
                    UpdatedAt = u.Preferences.UpdatedAt
                } : null,
                Profile = u.Profile != null ? new ProfileResponse
                {
                    Id = u.Profile.Id,
                    LongestStreak = u.Profile.LongestStreak,
                    CurrentStreak = u.Profile.CurrentStreak,
                    UserId = u.Id,
                    KoalaColour = u.Profile.KoalaColour,
                    KoalaName = u.Profile.KoalaName,
                    KoalaPronouns = u.Profile.KoalaPronouns,
                    School = u.Profile.School != null ? new SchoolResponse
                    {
                        Id = u.Profile.School.Id,
                        Name = u.Profile.School.Name!,
                        City = u.Profile.School.City!,
                        RegionCode = u.Profile.School.RegionCode!,
                        UserId = u.Id,
                        CountryCode = u.Profile.School.CountryCode,
                    } : null,
                } : null
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            _logger.LogWarning("User profile not found for ID: {UserId}", userId);
            throw new KeyNotFoundException("User profile not found");
        }

        return user;
    }
}
