using Microsoft.EntityFrameworkCore;
using Serene.Common;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Onboarding;

public interface IOnboardingService
{
    Task<OnboardingStatusResponse> GetStatusAsync(string userId);
    Task CompleteStep1Async(string userId, StepOneRequest dto);
    Task CompleteStep2Async(string userId, StepTwoRequest dto);
    Task CompleteStep3Async(string userId, StepThreeRequest dto);
    Task CompleteStep4Async(string userId, StepFourRequest dto);
    Task CompleteStep5Async(string userId, StepFiveRequest dto);
    Task CompleteStep6Async(string userId, StepSixRequest dto);
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
            _logger.LogWarning("Validation failed: User profile not found for ID: {UserId}", userId);
            throw new Exception("User profile not found");
        }

        if (user.OnboardingStep < requiredStep)
        {
            _logger.LogWarning("Step validation failed for user {UserId}. Required: {Required}, Current: {Current}",
                userId, requiredStep, user.OnboardingStep);
            throw new ArgumentException("You must complete previous steps first.");
        }
    }

    public async Task<OnboardingStatusResponse> GetStatusAsync(string userId)
    {
        _logger.LogInformation("Getting onboarding status for user: {UserId}", userId);
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Include(u => u.Profile)
                .ThenInclude(p => p!.School)
            .Select(u => new OnboardingStatusResponse
            {
                Step = u.OnboardingStep,
                Completed = u.OnboardingCompleted,
                Started = u.OnboardingStarted,
                Name = u.Name,
                DateOfBirth = u.DateOfBirth,
                Gender = u.Gender,
                Pronouns = u.Pronouns,
                CountryCode = u.CountryCode,
                SchoolName = u.Profile != null && u.Profile.School != null ? u.Profile.School.Name : null,
                KoalaName = u.Profile != null ? u.Profile.KoalaName : null,
                KoalaColour = u.Profile != null ? u.Profile.KoalaColour : null,
                KoalaPronouns = u.Profile != null ? u.Profile.KoalaPronouns : null,
                Struggles = u.Profile != null ? u.Profile.Struggles : new List<string>(),
            })
            .FirstOrDefaultAsync() ?? throw new AppException("User not found", ErrorCodes.UserNotFound);

        return user;
    }

    public async Task CompleteStep1Async(string userId, StepOneRequest dto)
    {
        _logger.LogInformation("User {UserId} completing Onboarding Step 1 (Identity)", userId);
        await ValidateStep(userId, 1);

        var user = await _context.Users.FindAsync(userId) ?? throw new AppException("User not found", ErrorCodes.UserNotFound);

        var exists = await _context.Users.AnyAsync(x => x.Name == dto.Name && x.Id != user.Id);
        if (exists)
        {
            throw new AppException("Username taken by someone", ErrorCodes.UsernameTaken);
        }

        user.Name = dto.Name;
        user.OnboardingStep = 2;
        user.OnboardingStarted = true;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteStep2Async(string userId, StepTwoRequest dto)
    {
        _logger.LogInformation("User {UserId} completing Onboarding Step 2 (Demographics)", userId);
        await ValidateStep(userId, 2);

        var user = await _context.Users.FindAsync(userId) ?? throw new AppException("User not found", ErrorCodes.UserNotFound);
        user.DateOfBirth = dto.DateOfBirth;
        user.Gender = dto.Gender;
        user.Pronouns = dto.Pronouns ?? "Prefer not to say";
        user.OnboardingStep = 3;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteStep3Async(string userId, StepThreeRequest dto)
    {
        _logger.LogInformation("User {UserId} completing Onboarding Step 3 (Geography)", userId);
        await ValidateStep(userId, 3);

        var user = await _context.Users.FindAsync(userId) ?? throw new AppException("User not found", ErrorCodes.UserNotFound);
        user.CountryCode = dto.CountryCode;
        user.OnboardingStep = 4;
        await _context.SaveChangesAsync();
    }

    public async Task CompleteStep4Async(string userId, StepFourRequest dto)
    {
        _logger.LogInformation("User {UserId} completing Onboarding Step 4 (School)", userId);
        await ValidateStep(userId, 4);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(userId) ?? throw new AppException("User not found", ErrorCodes.UserNotFound);
            var school = await _context.Schools.FirstOrDefaultAsync(s => s.Name == dto.Name);
            if (school == null)
            {
                _logger.LogInformation("Registering new school: {SchoolName} in {Country}", dto.Name, dto.CountryCode);
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Transaction failed while saving school for user {UserId}", userId);
            await transaction.RollbackAsync();
            throw new Exception($"Failed to save school details: {ex.Message}");
        }
    }

    public async Task CompleteStep5Async(string userId, StepFiveRequest dto)
    {
        _logger.LogInformation("User {UserId} completing Onboarding Step 5 (Companion)", userId);
        await ValidateStep(userId, 5);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(userId) ?? throw new AppException("User not found", ErrorCodes.UserNotFound);
            user.OnboardingStep = 6;

            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                profile = new Profile { UserId = userId, KoalaName = "Koala" };
                _context.Profiles.Add(profile);
            }

            profile.KoalaName = dto.KoalaName;
            profile.KoalaColour = dto.KoalaColour;
            profile.KoalaPronouns = dto.KoalaPronouns ?? "They/Them";

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Transaction failed while saving companion details for user {UserId}", userId);
            await transaction.RollbackAsync();
            throw new Exception($"Failed to save companion details: {ex.Message}");
        }
    }

    public async Task CompleteStep6Async(string userId, StepSixRequest dto)
    {
        _logger.LogInformation("User {UserId} completing Onboarding Step 6 (Struggles)", userId);
        await ValidateStep(userId, 6);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await _context.Users.FindAsync(userId) ?? throw new AppException("User not found", ErrorCodes.UserNotFound);
            user.OnboardingCompleted = true;
            user.OnboardingStep = -1;

            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null)
            {
                profile = new Profile { UserId = userId, KoalaName = "Koala" };
                _context.Profiles.Add(profile);
            }

            profile.Struggles = dto.Struggles;

            var prefs = new Settings
            {
                UserId = userId,
                Theme = "Light"
            };
            _context.Settings.Add(prefs);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            _logger.LogInformation("User {UserId} has fully completed onboarding", userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Transaction failed while finalizing onboarding for user {UserId}", userId);
            await transaction.RollbackAsync();
            throw new Exception($"Failed to complete onboarding: {ex.Message}");
        }
    }
}