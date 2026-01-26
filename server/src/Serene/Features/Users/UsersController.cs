using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Serene.Features.Users;

[ApiController]
[Route("users")]
public class UsersController : BaseApiController
{
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService, ILogger<UsersController> logger)
        : base(logger)
    {
        _usersService = usersService;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetUserProfile()
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        return await ExecuteWithResult(() => _usersService.GetUserProfileAsync(userId));
    }

    [HttpGet("exists/{email}")]
    public async Task<IActionResult> DoesUserExist(string email)
    {
        return await ExecuteWithResult(() => _usersService.DoesUserExistAsync(email));
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileRequest dto)
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        return await ExecuteWithResult(() => _usersService.UpdateUserProfileAsync(userId, dto));
    }

    [HttpPut("me/password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest dto)
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
            throw new UnauthorizedAccessException();

        return await ExecuteWithResult(async () =>
        {
            await _usersService.ChangePasswordAsync(userId, dto);
            return new { message = "Password changed successfully" };
        });
    }
}
