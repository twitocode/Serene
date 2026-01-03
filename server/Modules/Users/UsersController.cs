using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Modules.Users;

public class UserProfileResponseDto
{
    public UserDto User { get; set; } = new();
}

[ApiController]
[Route("users")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<UsersController> _logger;

    public UsersController(ApplicationDbContext context, ILogger<UsersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserProfileResponseDto>> GetUserProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Success = false, Message = "User ID not found in token" });
        }

        var user = await _context.Users
            .AsNoTracking()
            .Include(u => u.Profile)
            .Include(u => u.Preferences)
            .Where(u => u.Id == userId)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Image = u.Image,
                EmailConfirmed = u.EmailConfirmed,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt
                // Populate Profile/Preferences here if added to UserDto
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new { Success = false, Message = "User profile not found", Code = "USER_NOT_FOUND" });
        }

        return Ok(new UserProfileResponseDto { User = user });
    }

    [HttpGet("exists/{email}")]
    public async Task<IActionResult> DoesUserExist(string email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return BadRequest(new { Success = false, Message = "Email is required", Code = "MISSING_PARAM" });
        }

        var exists = await _context.Users.AnyAsync(u => u.Email == email);
        return Ok(new { Exists = exists });
    }
}