using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NodaTime;
using Serene.Features.AI;

namespace Serene.Features.Checkins;

[ApiController]
[Route("checkin")]
public class CheckinController : BaseApiController
{
    private readonly ICheckinService _checkinService;
    private readonly IAIService _aiService;

    public CheckinController(
        ICheckinService checkinService,
        IAIService aiService,
        ILogger<CheckinController> logger
    )
        : base(logger)
    {
        _checkinService = checkinService;
        _aiService = aiService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCheckin(
        [ModelBinder(typeof(LocalDateModelBinder))] LocalDate? date
    )
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();
        return await ExecuteWithResult(() => _checkinService.GetCheckinAsync(userId, date));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CompleteCheckin([ModelBinder(typeof(LocalDateModelBinder))] LocalDate? date, [FromBody] CompleteCheckinRequest body)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        return await ExecuteWithResult(() => _checkinService.CompleteCheckinAsync(userId, date, body));
    }

    [HttpPost("reframe")]
    [Authorize]
    public async Task<IActionResult> Reframe([FromBody] ReframeRequest body)
    {
        return await ExecuteWithResult(() => _aiService.ReframeLingering(body.LingeringThoughts));
    }
}
