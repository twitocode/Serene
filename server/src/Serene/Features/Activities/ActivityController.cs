using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NodaTime;

namespace Serene.Features.Activities;

[ApiController]
[Route("activities")]
public class ActivityController : BaseApiController
{
    private readonly IActivityService _activityService;

    public ActivityController(IActivityService activityService, ILogger<ActivityController> logger)
        : base(logger)
    {
        _activityService = activityService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetActivities(
        [ModelBinder(typeof(LocalDateModelBinder))] LocalDate? from,
        [ModelBinder(typeof(LocalDateModelBinder))] LocalDate? to)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        return await ExecuteWithResult(() => _activityService.GetActivitiesAsync(userId, from, to));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateActivity([FromBody] CreateActivityRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        return await ExecuteWithResult(() => _activityService.CreateActivityAsync(userId, body));
    }

    [HttpPost("{id}/complete")]
    [Authorize]
    public async Task<IActionResult> CompleteActivity(string id, [FromBody] CompleteActivityRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        return await ExecuteWithResult(() => _activityService.CompleteActivityAsync(userId, id, body));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteActivity(string id)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        return await ExecuteWithResult(async () =>
        {
            await _activityService.DeleteActivityAsync(userId, id);
            return true;
        });
    }
}
