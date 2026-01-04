using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Controllers;


[ApiController]
[Route("preferences")]
public class PreferencesController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public PreferencesController(ApplicationDbContext context, ILogger<PreferencesController> logger) : base(logger)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<PreferencesResponse>> GetUserPreferences()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Success = false, Message = "User ID not found in token" });
        }
        var prefs = await _context.Preferences.Where(x => x.UserId == userId).Select(x => new PreferencesResponse
        {
            PasswordLock = x.PasswordLock,
            Theme = x.Theme,
        }).FirstOrDefaultAsync();

        if (prefs == null)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
            if (user == null)
            {
                _logger.LogError("User {id} is supposed to exist but does not", userId);
                return NotFound(new { Success = false, Message = "User profile not found", Code = "USER_NOT_FOUND" });
            }

            var newPrefs = new Preferences
            {
                PasswordLock = null,
                Theme = "Light",
                UserId = userId
            };
            await _context.SaveChangesAsync();
            prefs = new PreferencesResponse { Theme = newPrefs.Theme, PasswordLock = newPrefs.PasswordLock };
        }

        return Ok(prefs);
    }


    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesDto dto)
    {
        return await ExecuteWithResult(async () =>
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException();

            var user = await _context.Users
                .Include(u => u.Preferences)
                .FirstOrDefaultAsync(u => u.Id == userId) ?? throw new KeyNotFoundException("User not found");
            if (user.Preferences == null)
            {
                user.Preferences = new Preferences { UserId = userId };
                _context.Preferences.Add(user.Preferences);
            }

            if (dto.Theme != null) user.Preferences.Theme = dto.Theme;
            if (dto.PasswordLock != null) user.Preferences.PasswordLock = dto.PasswordLock;

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
        });
    }

}