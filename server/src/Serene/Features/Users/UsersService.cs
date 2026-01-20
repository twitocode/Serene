using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Users;

public interface IUsersService
{
    Task<UserResponse> GetUserProfileAsync(string userId);
    Task<SettingsResponse> UpdateSettingsAsync(string userId, UpdateUserSettingsDto dto);
    Task<bool> DoesUserExistAsync(string email);
}

public class UsersService : IUsersService
{
    private readonly ApplicationDbContext _context;
    private readonly Microsoft.AspNetCore.Identity.UserManager<User> _userManager;
    private readonly ILogger<UsersService> _logger;
    private readonly HybridCache _cache;

    public UsersService(
        ApplicationDbContext context,
        Microsoft.AspNetCore.Identity.UserManager<User> userManager,
        ILogger<UsersService> logger,
        HybridCache cache
    )
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
        _cache = cache;
    }

    public async Task<UserResponse> GetUserProfileAsync(string userId)
    {
        _logger.LogInformation("Fetching profile for user: {UserId}", userId);
        var userResponse = await _cache.GetOrCreateAsync(
            $"profile-{userId}",
            async token =>
            {
                var userResponse = await _context
                    .Users.AsNoTracking()
                    .Include(u => u.Profile)
                        .ThenInclude(p => p!.School)
                    .Include(u => u.Settings)
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
                        Settings =
                            u.Settings != null
                                ? new SettingsResponse
                                {
                                    Id = u.Settings.Id,
                                    Theme = u.Settings.Theme,
                                    PasswordLock = u.Settings.PasswordLock,
                                    UserId = u.Settings.UserId,
                                    CreatedAt = u.Settings.CreatedAt,
                                    UpdatedAt = u.Settings.UpdatedAt,
                                }
                                : null,
                        Profile =
                            u.Profile != null
                                ? new ProfileResponse
                                {
                                    Id = u.Profile.Id,
                                    LongestStreak = u.Profile.LongestStreak,
                                    CurrentStreak = u.Profile.CurrentStreak,
                                    UserId = u.Id,
                                    KoalaColour = u.Profile.KoalaColour,
                                    KoalaName = u.Profile.KoalaName,
                                    KoalaPronouns = u.Profile.KoalaPronouns,

                                    School =
                                        u.Profile.School != null
                                            ? new SchoolResponse
                                            {
                                                Id = u.Profile.School.Id,
                                                Name = u.Profile.School.Name!,
                                                City = u.Profile.School.City!,
                                                RegionCode = u.Profile.School.RegionCode!,
                                                UserId = u.Id,
                                                CountryCode = u.Profile.School.CountryCode,
                                            }
                                            : null,
                                }
                                : null,
                    })
                    .FirstOrDefaultAsync();
                return userResponse;
                //TODO: invalidate when editing user in any way
            },
            tags: [$"profile-{userId}"]
        );

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

    public async Task<SettingsResponse> UpdateSettingsAsync(
        string userId,
        UpdateUserSettingsDto dto
    )
    {
        _logger.LogInformation("Updating preferences for user: {UserId}", userId);
        var user = await _context
            .Users.Include(u => u.Settings)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            _logger.LogWarning("Preference update failed: User {UserId} not found", userId);
            throw new KeyNotFoundException("User not found");
        }

        if (user.Settings == null)
        {
            _logger.LogInformation("Creating new preferences record for user: {UserId}", userId);
            user.Settings = new Serene.Entities.Settings { UserId = userId };
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

    public async Task<bool> DoesUserExistAsync(string email)
    {
        _logger.LogInformation("Checking if user exists with email: {Email}", email);
        return await _context.Users.AnyAsync(u => u.Email == email);
    }
}
