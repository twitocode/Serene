using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NodaTime;

namespace Serene.Features.Checkins;

[ApiController]
[Route("checkin")]
public class CheckinController : BaseApiController
{
    private readonly ICheckinService _checkinService;

    public CheckinController(ICheckinService onboardingService, ILogger<CheckinController> logger) : base(logger)
    {
        _checkinService = onboardingService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCheckin([ModelBinder(typeof(LocalDateModelBinder))] LocalDate? date)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();
        return await ExecuteWithResult(() => _checkinService.GetCheckinAsync(userId, date));
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CompleteCheckin([FromBody] CompleteCheckinRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _checkinService.CompleteCheckinAsync(userId, body));
    }
}