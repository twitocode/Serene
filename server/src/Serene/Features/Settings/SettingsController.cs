using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Serene.Features.UserSettings;

[ApiController]
[Route("settings")]
public class SettingsController : BaseApiController
{
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService, ILogger<SettingsController> logger)
        : base(logger)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetSettings()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();
        return await ExecuteWithResult(() => _settingsService.GetSettingsAsync(userId));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateSettingsDto body)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        return await ExecuteWithResult(() => _settingsService.UpdateSettingsAsync(userId, body));
    }
}
