using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.Common;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;
using Serene.Services;

namespace Serene.Controllers;

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
    public async Task<IActionResult> CheckEmail([FromBody] CheckEmailDto dto)
    {
        return await ExecuteWithResult(() => _authService.CheckEmailAsync(dto.Email));
    }

    [HttpPost("sign-up/email")]
    public async Task<IActionResult> SignUp([FromBody] EmailSignUpDto dto)
    {
        return await ExecuteWithResult(async () =>
        {
            var result = await _authService.SignUpAsync(dto);
            SetTokenCookie(result.Token);
            return result;
        });
    }

    [HttpPost("sign-in/email")]
    public async Task<IActionResult> SignIn([FromBody] EmailSignInDto dto)
    {
        return await ExecuteWithResult(async () =>
        {
            var result = await _authService.SignInAsync(dto);
            SetTokenCookie(result.Token);
            return result;
        });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
    {
        return await ExecuteWithResult(async () =>
        {
            var result = await _authService.GoogleLoginAsync(dto.IdToken);
            SetTokenCookie(result.Token);
            return result;
        });
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