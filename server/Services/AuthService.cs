using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;
using System.Security.Claims;
namespace Serene.Services;

public interface IAuthService
{
    Task<CheckEmailResponseDto> CheckEmailAsync(string email);
    Task<AuthResponseDto> SignUpAsync(EmailSignUpDto dto);
    Task<AuthResponseDto> SignInAsync(EmailSignInDto dto);
    Task<AuthResponseDto> HandleGoogleCallbackAsync(ClaimsPrincipal principal);
}

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthService> _logger;
    private readonly ApplicationDbContext _context;
    public AuthService(UserManager<User> userManager, TokenService tokenService, ILogger<AuthService> logger, ApplicationDbContext context)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _logger = logger;
        _context = context;
    }

    public async Task<CheckEmailResponseDto> CheckEmailAsync(string email)
    {
        _logger.LogInformation("Checking existence of email: {Email}", email);
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            _logger.LogInformation("Email {Email} does not exist", email);
            return new CheckEmailResponseDto { Exists = false };
        }

        var hasPassword = await _userManager.HasPasswordAsync(user);
        var logins = await _userManager.GetLoginsAsync(user);
        var providers = logins.Select(l => l.LoginProvider).ToList();

        if (hasPassword)
        {
            providers.Add("credential");
        }

        _logger.LogInformation("Email {Email} exists with providers: {Providers}", email, string.Join(", ", providers));
        return new CheckEmailResponseDto
        {
            Exists = true,
            HasPassword = hasPassword,
            Providers = providers
        };
    }

    public async Task<AuthResponseDto> SignUpAsync(EmailSignUpDto dto)
    {
        _logger.LogInformation("Attempting to sign up user with email: {Email}", dto.Email);
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            _logger.LogWarning("Sign up failed: User with email {Email} already exists", dto.Email);
            throw new ArgumentException("User already exists");
        }

        var user = new User
        {
            UserName = dto.Email,
            Email = dto.Email,
            Name = dto.Email, //temporary until the onboarding
            EmailConfirmed = false
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            _logger.LogError("User creation failed for {Email}: {Errors}", dto.Email, errors);
            throw new Exception("Sign up failed: " + errors);
        }

        var profile = new Profile
        {
            UserId = user.Id,
        };

        _context.Profiles.Add(profile);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {Email} signed up successfully", dto.Email);
        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponseDto> SignInAsync(EmailSignInDto dto)
    {
        _logger.LogInformation("Login attempt for email: {Email}", dto.Email);
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            _logger.LogWarning("Invalid login attempt for email: {Email}", dto.Email);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        _logger.LogInformation("User {Email} logged in successfully", dto.Email);
        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponseDto> HandleGoogleCallbackAsync(ClaimsPrincipal principal)
    {
        _logger.LogInformation("Handling Google callback");
        
        var email = principal.FindFirstValue(ClaimTypes.Email);
        if (email == null)
        {
            throw new Exception("Email claim not found");
        }

        // Extract Country Code
        var countryCode = principal.FindFirstValue(ClaimTypes.Country) ??
                          principal.FindFirstValue("locale")?.Split('-').LastOrDefault()?.ToUpper();

        // Extract Gender
        var gender = "";
        var genderClaimValue = principal.FindFirstValue(ClaimTypes.Gender);
        if (!string.IsNullOrEmpty(genderClaimValue))
        {
             if (genderClaimValue.Equals("male", StringComparison.OrdinalIgnoreCase)) gender = "Male";
             else if (genderClaimValue.Equals("female", StringComparison.OrdinalIgnoreCase)) gender = "Female";
             else if (genderClaimValue.Equals("non-binary", StringComparison.OrdinalIgnoreCase)) gender = "NonBinary";
        }

        // Extract AvatarUrl
        var avatarUrl = principal.FindFirstValue("picture");
        
        // Extract Name
        var name = principal.FindFirstValue(ClaimTypes.Name) ?? email;

        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            _logger.LogInformation("Creating new user from Google principal: {Email}", email);
            user = new User
            {
                UserName = email,
                Email = email,
                Name = name,
                Image = avatarUrl,
                CountryCode = countryCode,
                Gender = gender,
                EmailConfirmed = true // Trusted provider
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                _logger.LogError("Failed to create user from Google: {Errors}", errors);
                throw new Exception("Failed to create user: " + errors);
            }

            var profile = new Profile
            {
                UserId = user.Id,
            };
            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();
        }

        // Check if login already exists
        var logins = await _userManager.GetLoginsAsync(user);
        var subject = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (subject != null && !logins.Any(l => l.LoginProvider == "Google" && l.ProviderKey == subject))
        {
            _logger.LogInformation("Linking Google account for user: {Email}", email);
            await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", subject, "Google"));
        }

        var token = _tokenService.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Image = user.Image,
            EmailConfirmed = user.EmailConfirmed,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
