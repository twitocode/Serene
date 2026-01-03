using Microsoft.EntityFrameworkCore;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;

namespace Serene.Services;

public interface IOnboardingService
{
    Task<object> GetStatusAsync(string userId);
    Task CompleteStep1Async(string userId, StepOneDto dto);
    Task CompleteStep2Async(string userId, StepTwoDto dto);
    Task CompleteStep3Async(string userId, StepThreeDto dto);
    Task CompleteStep4Async(string userId, StepFourDto dto);
    Task CompleteStep5Async(string userId, StepFiveDto dto);
}

public class OnboardingService : IOnboardingService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OnboardingService> _logger;

    public OnboardingService(ApplicationDbContext context, ILogger<OnboardingService> logger)
    {
        _context = context;
        _logger = logger;
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

    public async Task<object> GetStatusAsync(string userId)
    {
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
            throw new Exception("User not found");
        }

        return new
        {
            Step = user.OnboardingStep,
            Completed = user.OnboardingCompleted,
            Started = user.OnboardingStarted
        };
    }

    public async Task CompleteStep1Async(string userId, StepOneDto dto)
    {
        await ValidateStep(userId, 1);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        var exists = await _context.Users.AnyAsync(u => u.Name == dto.Name);
        if (exists)
        {
            throw new ArgumentException("User already exists");
        }
        user.Name = dto.Name;
        user.OnboardingStep = 2;
        user.OnboardingStarted = true;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteStep2Async(string userId, StepTwoDto dto)
    {
        await ValidateStep(userId, 2);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        user.Age = dto.Age;
        user.Gender = dto.Gender;
        user.Pronouns = dto.Pronouns ?? "Prefer not to say";
        user.OnboardingStep = 3;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteStep3Async(string userId, StepThreeDto dto)
    {
        await ValidateStep(userId, 3);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) throw new Exception("User not found");

        user.CountryCode = dto.CountryCode;
        user.OnboardingStep = 4;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteStep4Async(string userId, StepFourDto dto)
    {
        await ValidateStep(userId, 4);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");

            var school = await _context.Schools.FirstOrDefaultAsync(s => s.Name == dto.Name);
            if (school == null)
            {
                _logger.LogWarning("School {name} does not exist in Db, creating it now", dto.Name);
                school = new School
                {
                    Name = dto.Name,
                    CountryCode = dto.CountryCode,
                    City = dto.City,
                    RegionCode = dto.RegionCode
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
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task CompleteStep5Async(string userId, StepFiveDto dto)
    {
        await ValidateStep(userId, 5);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");

            user.OnboardingCompleted = true;
            user.OnboardingStep = -1;

            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                profile = new Profile { UserId = userId, KoalaName = "Koala" };
                _context.Profiles.Add(profile);
            }

            profile.KoalaName = dto.KoalaName;
            profile.KoalaColour = dto.KoalaColour;
            profile.KoalaPronouns = dto.KoalaPronouns ?? "They/Them";

            var prefs = new Preferences
            {
                UserId = userId,
                Theme = "Light"
            };
            _context.Preferences.Add(prefs);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
