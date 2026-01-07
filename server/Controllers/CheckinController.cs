using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serene.DTOs;
using Serene.Services;

namespace Serene.Controllers;

[ApiController]
[Route("users/onboarding")]
public class CheckinController : BaseApiController
{
    private readonly IOnboardingService _onboardingService;

    public CheckinController(IOnboardingService onboardingService, ILogger<OnboardingController> logger) : base(logger)
    {
        _onboardingService = onboardingService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetCheckinStatus()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.GetStatusAsync(userId));
    }

    [HttpPost("step1")]
    [Authorize]
    public async Task<IActionResult> EmotionIdentificationStep([FromBody] StepOneRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep1Async(userId, body));
    }

    [HttpPost("step2")]
    [Authorize]
    public async Task<IActionResult> RandomPromptStep([FromBody] StepTwoRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep2Async(userId, body));
    }

    [HttpPost("step3")]
    [Authorize]
    public async Task<IActionResult> SomaticStateStep([FromBody] StepThreeRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep3Async(userId, body));
    }

    [HttpPost("step4")]
    [Authorize]
    public async Task<IActionResult> LingeringThoughtsStep([FromBody] StepFourRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep4Async(userId, body));
    }
}
