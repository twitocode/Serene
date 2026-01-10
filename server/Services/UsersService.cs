using Microsoft.EntityFrameworkCore;
using Serene.Controllers;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Services;

public interface IUsersService
{
    Task<UserResponse> GetUserProfileAsync(string userId);
    Task<PreferencesResponse> UpdatePreferencesAsync(string userId, UpdatePreferencesDto dto);
    Task<bool> DoesUserExistAsync(string email);
}

public class UsersService : IUsersService
{
    private readonly ApplicationDbContext _context;
    private readonly Microsoft.AspNetCore.Identity.UserManager<User> _userManager;
    private readonly ILogger<UsersService> _logger;

    public UsersService(ApplicationDbContext context, Microsoft.AspNetCore.Identity.UserManager<User> userManager, ILogger<UsersService> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    public async Task<UserResponse> GetUserProfileAsync(string userId)
    {
        _logger.LogInformation("Fetching profile for user: {UserId}", userId);
        var userResponse = await _context.Users
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
                Gender = u.Gender,
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

        if (userResponse == null)
        {
            _logger.LogWarning("User profile not found for ID: {UserId}", userId);
            throw new KeyNotFoundException("User profile not found");
        }

        var userEntity = await _userManager.FindByIdAsync(userId);
        if (userEntity != null)
        {
            var roles = await _userManager.GetRolesAsync(userEntity);
            userResponse.Roles = roles.ToList();
        }

        return userResponse;
    }

    public async Task<PreferencesResponse> UpdatePreferencesAsync(string userId, UpdatePreferencesDto dto)
    {
        _logger.LogInformation("Updating preferences for user: {UserId}", userId);
        var user = await _context.Users
            .Include(u => u.Preferences)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            _logger.LogWarning("Preference update failed: User {UserId} not found", userId);
            throw new KeyNotFoundException("User not found");
        }

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

    public async Task<bool> DoesUserExistAsync(string email)
    {
        _logger.LogInformation("Checking if user exists with email: {Email}", email);
        return await _context.Users.AnyAsync(u => u.Email == email);
    }
}