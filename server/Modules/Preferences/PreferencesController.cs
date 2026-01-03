using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Modules.Users;


[ApiController]
[Route("preferences")]
public class PreferencesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PreferencesController> _logger;

    public PreferencesController(ApplicationDbContext context, ILogger<PreferencesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<PreferencesDto>> GetUserPreferences()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Success = false, Message = "User ID not found in token" });
        }
        var prefs = await _context.Preferences.Where(x => x.UserId == userId).Select(x => new PreferencesDto
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
            prefs = new PreferencesDto { Theme = newPrefs.Theme, PasswordLock = newPrefs.PasswordLock };
        }

        return Ok(prefs);
    }
}