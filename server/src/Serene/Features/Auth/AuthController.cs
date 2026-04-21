using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Hosting;
using Serene.Common;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Auth;

[ApiController]
[Route("auth")]
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;
    private readonly IWebHostEnvironment _environment;

    public AuthController(
        IAuthService authService,
        IWebHostEnvironment environment,
        ILogger<AuthController> logger
    )
        : base(logger)
    {
        _authService = authService;
        _environment = environment;
    }

    private CookieOptions GetCookieOptions()
    {
        var dev = _environment.IsDevelopment();
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = !dev,
            SameSite = dev ? SameSiteMode.Lax : SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/",
        };
    }

    private void SetTokenCookie(string token)
    {
        Response.Cookies.Append("session_token", token, GetCookieOptions());
    }

    [HttpPost("check-email")]
    [EnableRateLimiting("auth-strict")]
    public async Task<IActionResult> CheckEmail([FromBody] CheckEmailRequest dto)
    {
        return await ExecuteWithResult(() => _authService.CheckEmailAsync(dto.Email));
    }

    [HttpPost("sign-up/email")]
    [EnableRateLimiting("auth-strict")]
    public async Task<IActionResult> SignUp([FromBody] EmailSignUpRequest dto)
    {
        return await ExecuteWithResult(async () =>
        {
            var result = await _authService.SignUpAsync(dto);
            SetTokenCookie(result.Token);
            return result;
        });
    }

    [HttpPost("sign-in/email")]
    [EnableRateLimiting("auth-strict")]
    public async Task<IActionResult> SignIn([FromBody] EmailSignInRequest dto)
    {
        return await ExecuteWithResult(async () =>
        {
            var result = await _authService.SignInAsync(dto);
            SetTokenCookie(result.Token);
            return result;
        });
    }

    [HttpGet("sign-in/google")]
    public IActionResult LoginGoogle([FromQuery] string returnUrl)
    {
        var redirectUrl = Url.Action("GoogleCallback", "Auth", new { returnUrl });
        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("sign-in/google/callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string returnUrl)
    {
        var result = await HttpContext.AuthenticateAsync("ExternalCookie");

        if (!result.Succeeded)
        {
            return Unauthorized();
        }

        var authResponse = await _authService.HandleGoogleCallbackAsync(result.Principal);
        SetTokenCookie(authResponse.Token);

        return Redirect(returnUrl);
    }

    [HttpPost("sign-out")]
    public async Task<IActionResult> Logout()
    {
        _logger.LogInformation("Sign-out request received.");
        var options = GetCookieOptions();

        if (Request.Cookies.ContainsKey("session_token"))
        {
            _logger.LogInformation("Deleting session_token cookie.");
            Response.Cookies.Delete("session_token", options);
        }
        else
        {
            _logger.LogWarning("Sign-out requested but no session_token cookie was found.");
        }

        return await Task.FromResult(Ok(new { success = true, message = "Logged out" }));
    }
}
