using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serene.Services;

namespace Serene.Controllers;

public class UpdatePreferencesDto
{
    public string? Theme { get; set; }
    public string? PasswordLock { get; set; }
}

[ApiController]
[Route("users")]
public class UsersController : BaseApiController
{
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService, ILogger<UsersController> logger) : base(logger)
    {
        _usersService = usersService;
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetUserProfile()
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException();

        return await ExecuteWithResult(() => _usersService.GetUserProfileAsync(userId));
    }
    [HttpGet("exists/{email}")]
    public async Task<IActionResult> DoesUserExist(string email)
    {
        return await ExecuteWithResult(() => _usersService.DoesUserExistAsync(email));
    }
}