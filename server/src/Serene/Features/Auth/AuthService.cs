using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;
using Serene.Common;
using Serene.Data;
using Serene.Entities;
using Serene.Services;

namespace Serene.Features.Auth;

public interface IAuthService
{
    Task<CheckEmailResponse> CheckEmailAsync(string email);
    Task<AuthResponse> SignUpAsync(EmailSignUpRequest dto);
    Task<AuthResponse> SignInAsync(EmailSignInRequest dto);
    Task<AuthResponse> HandleGoogleCallbackAsync(ClaimsPrincipal principal);
}

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly TokenService _tokenService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AuthService> _logger;
    private readonly HybridCache _cache;
    private readonly IStreakService _streakService;

    public AuthService(
        UserManager<User> userManager,
        TokenService tokenService,
        ApplicationDbContext context,
        ILogger<AuthService> logger,
        HybridCache hybridCache,
        IStreakService streakService
    )
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
        _logger = logger;
        _cache = hybridCache;
        _streakService = streakService;
    }

    public async Task<CheckEmailResponse> CheckEmailAsync(string email)
    {
        _logger.LogInformation("Checking existence of email: {Email}", email);
        var user = await _userManager.FindByEmailAsync(email);

        if (user == null)
        {
            _logger.LogInformation("Email {Email} does not exist", email);
            return new CheckEmailResponse { Exists = false };
        }

        var hasPassword = await _userManager.HasPasswordAsync(user);
        var logins = await _userManager.GetLoginsAsync(user);
        var providers = logins.Select(l => l.LoginProvider).ToList();

        if (hasPassword)
        {
            providers.Add("credential");
        }

        _logger.LogInformation(
            "Email {Email} exists with providers: {Providers}",
            email,
            string.Join(", ", providers)
        );
        return new CheckEmailResponse
        {
            Exists = true,
            HasPassword = hasPassword,
            Providers = providers,
        };
    }

    public async Task<AuthResponse> SignUpAsync(EmailSignUpRequest dto)
    {
        _logger.LogInformation("Attempting to sign up user with email: {Email}", dto.Email);
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            _logger.LogWarning("Sign up failed: User with email {Email} already exists", dto.Email);
            throw new ArgumentException("User already exists");
        }

        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var user = new User
            {
                UserName = dto.Email,
                Email = dto.Email,
                EmailConfirmed = false,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                _logger.LogError("User creation failed for {Email}: {Errors}", dto.Email, errors);
                throw new Exception("Sign up failed: " + errors);
            }

            var profile = new Profile { UserId = user.Id, MochiName = "Mochi" };

            _context.Profiles.Add(profile);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            _logger.LogInformation("User {Email} signed up successfully", dto.Email);
            var roles = await GetUserRoles(user);
            var token = _tokenService.GenerateToken(user, roles);

            return new AuthResponse { Token = token, User = MapToDto(user, roles) };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<AuthResponse> SignInAsync(EmailSignInRequest dto)
    {
        _logger.LogInformation("Login attempt for email: {Email}", dto.Email);
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        {
            _logger.LogWarning("Invalid login attempt for email: {Email}", dto.Email);
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        _logger.LogInformation("User {Email} logged in successfully", dto.Email);

        // Update streak upon login
        await _streakService.UpdateStreakAsync(user.Id);

        var roles = await GetUserRoles(user);
        var token = _tokenService.GenerateToken(user, roles);

        return new AuthResponse { Token = token, User = MapToDto(user, roles) };
    }

    public async Task<AuthResponse> HandleGoogleCallbackAsync(ClaimsPrincipal principal)
    {
        _logger.LogInformation("Handling Google callback");

        var email =
            principal.FindFirstValue(ClaimTypes.Email)
            ?? throw new Exception("Email claim not found");

        // Extract Country Code
        var countryCode =
            principal.FindFirstValue(ClaimTypes.Country)
            ?? principal.FindFirstValue("locale")?.Split('-').LastOrDefault()?.ToUpper();

        // Extract Gender
        var gender = "";
        var genderClaimValue = principal.FindFirstValue(ClaimTypes.Gender);
        if (!string.IsNullOrEmpty(genderClaimValue))
        {
            if (genderClaimValue.Equals("male", StringComparison.OrdinalIgnoreCase))
                gender = "Male";
            else if (genderClaimValue.Equals("female", StringComparison.OrdinalIgnoreCase))
                gender = "Female";
            else if (genderClaimValue.Equals("non-binary", StringComparison.OrdinalIgnoreCase))
                gender = "NonBinary";
        }

        // Extract AvatarUrl
        var avatarUrl = principal.FindFirstValue("picture");
        var name = principal.FindFirstValue(ClaimTypes.Name) ?? email;

        await using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
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
                    EmailConfirmed = true,
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                    _logger.LogError("Failed to create user from Google: {Errors}", errors);
                    throw new Exception("Failed to create user: " + errors);
                }

                var profile = new Profile { UserId = user.Id, MochiName = "Mochi" };
                _context.Profiles.Add(profile);
                await _context.SaveChangesAsync();
            }

            // Check if login already exists
            var logins = await _userManager.GetLoginsAsync(user);
            var subject = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (
                subject != null
                && !logins.Any(l => l.LoginProvider == "Google" && l.ProviderKey == subject)
            )
            {
                _logger.LogInformation("Linking Google account for user: {Email}", email);
                await _userManager.AddLoginAsync(
                    user,
                    new UserLoginInfo("Google", subject, "Google")
                );
            }

            // Update streak upon login
            await _streakService.UpdateStreakAsync(user.Id);

            var roles = await GetUserRoles(user);
            var token = _tokenService.GenerateToken(user, roles);

            await transaction.CommitAsync();

            return new AuthResponse { Token = token, User = MapToDto(user, roles) };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private async Task<IList<string>> GetUserRoles(User user)
    {
        return await _cache.GetOrCreateAsync(
            $"user-roles-{user.Id}",
            async token => await _userManager.GetRolesAsync(user),
            options: new HybridCacheEntryOptions { Expiration = TimeSpan.FromMinutes(30) }
        );
    }

    private static UserResponse MapToDto(User user, IList<string> roles)
    {
        return new UserResponse
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            Image = user.Image,
            Roles = roles.ToList(),
            EmailConfirmed = user.EmailConfirmed,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
        };
    }
}
