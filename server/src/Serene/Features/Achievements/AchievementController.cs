using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serene.Services;

namespace Serene.Features.Achievements;

[ApiController]
[Route("achievements")]
public class AchievementController : BaseApiController
{
    private readonly IAchievementService _achievementService;

    public AchievementController(
        IAchievementService achievementService,
        ILogger<AchievementController> logger
    )
        : base(logger)
    {
        _achievementService = achievementService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAchievements()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();
        return await ExecuteWithResult(() => _achievementService.GetAllAchievementsAsync(userId));
    }
}
