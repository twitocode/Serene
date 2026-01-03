using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Modules.Onboarding;

[ApiController]
[Route("users/onboarding")]
public class OnboardingController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OnboardingController> _logger;

    public OnboardingController(ApplicationDbContext context, ILogger<OnboardingController> logger)
    {
        _context = context;
        _logger = logger;
    }

    private string? GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetOnboardingStatus()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new
            {
                u.OnboardingStep,
                u.OnboardingCompleted,
                u.OnboardingStarted
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return StatusCode(500, new { Success = false, Message = "User should exist but does not", Code = "SERVER_ERROR" });
        }

        return Ok(new
        {
            Step = user.OnboardingStep,
            Completed = user.OnboardingCompleted,
            Started = user.OnboardingStarted
        });
    }

    private async Task ValidateStep(string userId, int requiredStep)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.OnboardingStep })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            throw new Exception("User profile not found"); 
        }

        if (user.OnboardingStep < requiredStep)
        {
            throw new ArgumentException("You must complete previous steps first.");
        }
    }

    [HttpPost("step1")]
    [Authorize]
    public async Task<IActionResult> SubmitStep1([FromBody] StepOneDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await ValidateStep(userId, 1);

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.Name = body.Name;
        user.OnboardingStep = 2;
        user.OnboardingStarted = true;

        await _context.SaveChangesAsync();
        return Ok(new { Success = true });
    }

    [HttpPost("step2")]
    [Authorize]
    public async Task<IActionResult> SubmitStep2([FromBody] StepTwoDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await ValidateStep(userId, 2);

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.Age = body.Age;
        user.Gender = body.Gender;
        user.Pronouns = body.Pronouns ?? "Prefer not to say";
        user.OnboardingStep = 3;

        await _context.SaveChangesAsync();
        return Ok(new { Success = true });
    }

    [HttpPost("step3")]
    [Authorize]
    public async Task<IActionResult> SubmitStep3([FromBody] StepThreeDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await ValidateStep(userId, 3);

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        user.CountryCode = body.CountryCode;
        user.OnboardingStep = 4;

        await _context.SaveChangesAsync();
        return Ok(new { Success = true });
    }

    [HttpPost("step4")]
    [Authorize]
    public async Task<IActionResult> SubmitStep4([FromBody] StepFourDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await ValidateStep(userId, 4);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            var school = await _context.Schools.FirstOrDefaultAsync(s => s.Name == body.Name);
            if (school == null)
            {
                school = new School
                {
                    Name = body.Name,
                    CountryCode = body.CountryCode,
                    City = body.City,
                    RegionCode = body.RegionCode
                };
                _context.Schools.Add(school);
                await _context.SaveChangesAsync();
            }

            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                profile = new Profile { UserId = userId, KoalaName = "Koala" };
                _context.Profiles.Add(profile);
            }
            
            profile.SchoolId = school.Id;
            user.OnboardingStep = 5;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { Success = true });
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPost("step5")]
    [Authorize]
    public async Task<IActionResult> SubmitStep5([FromBody] StepFiveDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await ValidateStep(userId, 5);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.OnboardingCompleted = true;
            user.OnboardingStep = -1; // -1 to indicate done? Logic in TS says -1, schema default is 1.

            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                profile = new Profile { UserId = userId, KoalaName = "Koala" };
                _context.Profiles.Add(profile);
            }

            profile.KoalaName = body.KoalaName;
            profile.KoalaColour = body.KoalaColour;
            profile.KoalaPronouns = body.KoalaPronouns ?? "They/Them";

            var prefs = new Preferences
            {
                UserId = userId,
                Theme = "Light"
            };
            _context.Preferences.Add(prefs);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return Ok(new { Success = true });
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
