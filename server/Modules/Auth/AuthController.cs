using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;
using Serene.Services;

namespace Serene.Modules.Auth;

public class GoogleLoginDto
{
    public string IdToken { get; set; } = string.Empty;
}

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly ApplicationDbContext _context;
    private readonly TokenService _tokenService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<User> userManager,
        ApplicationDbContext context, 
        TokenService tokenService, 
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _context = context;
        _tokenService = tokenService;
        _logger = logger;
    }

    private void SetTokenCookie(string token)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7)
        };
        Response.Cookies.Append("session_token", token, cookieOptions);
    }

    [HttpGet("get-session")]
    public async Task<ActionResult<object?>> GetSession()
    {
        var token = Request.Cookies["session_token"];
        if (string.IsNullOrEmpty(token))
        {
            return Ok(null);
        }

        var principal = _tokenService.ValidateToken(token);
        if (principal == null)
        {
            return Ok(null);
        }

        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
        {
            return Ok(null);
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return Ok(null);
        }

        // Get expiration from token or default to now + 7 days
        var expClaim = principal.FindFirst("exp");
        Instant expiresAt;
        if (expClaim != null && long.TryParse(expClaim.Value, out var expSeconds))
        {
             expiresAt = Instant.FromUnixTimeSeconds(expSeconds);
        }
        else
        {
             expiresAt = SystemClock.Instance.GetCurrentInstant().Plus(Duration.FromDays(7));
        }

        return Ok(new
        {
            session = new
            {
                Id = Guid.NewGuid().ToString(),
                UserId = user.Id,
                ExpiresAt = expiresAt,
                Token = token,
                CreatedAt = SystemClock.Instance.GetCurrentInstant(),
                UpdatedAt = SystemClock.Instance.GetCurrentInstant(),
                IpAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            },
            user = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Image = user.Image,
                EmailConfirmed = user.EmailConfirmed,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            }
        });
    }

    [HttpPost("sign-out")]
    public IActionResult SignOut()
    {
        Response.Cookies.Delete("session_token");
        return Ok(new { Success = true, Message = "Signed out successfully" });
    }

    [HttpPost("check-email")]
    public async Task<ActionResult<CheckEmailResponseDto>> CheckEmail([FromBody] CheckEmailDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            return Ok(new CheckEmailResponseDto { Exists = false });
        }

        var hasPassword = await _userManager.HasPasswordAsync(user);
        var logins = await _userManager.GetLoginsAsync(user);
        var providers = logins.Select(l => l.LoginProvider).ToList();
        
        if (hasPassword)
        {
            providers.Add("credential");
        }

        return Ok(new CheckEmailResponseDto
        { 
            Exists = true, 
            HasPassword = hasPassword,
            Providers = providers 
        });
    }

    [HttpPost("sign-up/email")]
    public async Task<ActionResult<AuthResponseDto>> SignUp([FromBody] EmailSignUpDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null)
        {
            return BadRequest(new { Success = false, Message = "User already exists", Code = "USER_EXISTS" });
        }

        var user = new User
        {
            UserName = dto.Email,
            Email = dto.Email,
            Name = dto.Name,
            EmailConfirmed = false,
            CreatedAt = SystemClock.Instance.GetCurrentInstant(),
            UpdatedAt = SystemClock.Instance.GetCurrentInstant()
        };

        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(new { Success = false, Message = "Sign up failed", Errors = result.Errors });
        }

        var token = _tokenService.GenerateToken(user);
        SetTokenCookie(token);
        
        return Ok(new AuthResponseDto 
        { 
            Token = token, 
            User = new UserDto 
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Image = user.Image,
                EmailConfirmed = user.EmailConfirmed,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            } 
        });
    }

    [HttpPost("sign-in/email")]
    public async Task<ActionResult<AuthResponseDto>> SignIn([FromBody] EmailSignInDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            return Unauthorized(new { Success = false, Message = "Invalid credentials", Code = "INVALID_CREDENTIALS" });
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);

        if (!isPasswordValid)
        {
            return Unauthorized(new { Success = false, Message = "Invalid credentials", Code = "INVALID_CREDENTIALS" });
        }

        var token = _tokenService.GenerateToken(user);
        SetTokenCookie(token);

        return Ok(new AuthResponseDto 
        { 
            Token = token, 
            User = new UserDto 
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Image = user.Image,
                EmailConfirmed = user.EmailConfirmed,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            } 
        });
    }

    [HttpPost("google")]
    public async Task<ActionResult<AuthResponseDto>> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        try
        {
            var payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken);
            
            var user = await _userManager.FindByEmailAsync(payload.Email);
            
            if (user == null)
            {
                user = new User
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    Name = payload.Name,
                    Image = payload.Picture,
                    EmailConfirmed = payload.EmailVerified,
                    CreatedAt = SystemClock.Instance.GetCurrentInstant(),
                    UpdatedAt = SystemClock.Instance.GetCurrentInstant()
                };
                
                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    throw new Exception("Failed to create user: " + string.Join(", ", createResult.Errors.Select(e => e.Description)));
                }
            }

            // Link Google Login if not exists
            var logins = await _userManager.GetLoginsAsync(user);
            if (!logins.Any(l => l.LoginProvider == "Google" && l.ProviderKey == payload.Subject))
            {
                await _userManager.AddLoginAsync(user, new UserLoginInfo("Google", payload.Subject, "Google"));
            }

            var token = _tokenService.GenerateToken(user);
            SetTokenCookie(token);

            return Ok(new AuthResponseDto 
            { 
                Token = token, 
                User = new UserDto 
                {
                    Id = user.Id,
                    Email = user.Email,
                    Name = user.Name,
                    Image = user.Image,
                    EmailConfirmed = user.EmailConfirmed,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt
                } 
            });
        }
        catch (InvalidJwtException ex)
        {
            _logger.LogWarning(ex, "Invalid Google Token");
            return BadRequest(new { Success = false, Message = "Invalid Google Token" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Login failed");
            return StatusCode(500, new { Success = false, Message = "Login failed: " + ex.Message });
        }
    }
}