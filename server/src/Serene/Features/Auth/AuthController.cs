using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.Common;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Auth;

[ApiController]
[Route("auth")]
public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService, ILogger<AuthController> logger) : base(logger)
    {
        _authService = authService;
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

    [HttpPost("check-email")]
    public async Task<IActionResult> CheckEmail([FromBody] CheckEmailRequest dto)
    {
        return await ExecuteWithResult(() => _authService.CheckEmailAsync(dto.Email));
    }

    [HttpPost("sign-up/email")]
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
        return await ExecuteWithResult(() =>
        {
            Response.Cookies.Delete("session_token");
            return Task.CompletedTask;
        });
    }
}