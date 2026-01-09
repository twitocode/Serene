using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serene.DTOs;
using Serene.Services;

namespace Serene.Controllers;

[ApiController]
[Route("users/onboarding")]
public class OnboardingController : BaseApiController
{
    private readonly IOnboardingService _onboardingService;

    public OnboardingController(IOnboardingService onboardingService, ILogger<OnboardingController> logger) : base(logger)
    {
        _onboardingService = onboardingService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetOnboardingStatus()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.GetStatusAsync(userId));
    }

    [HttpPost("step1")]
    [Authorize]
    public async Task<IActionResult> SubmitStep1([FromBody] StepOneRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep1Async(userId, body));
    }

    [HttpPost("step2")]
    [Authorize]
    public async Task<IActionResult> SubmitStep2([FromBody] StepTwoRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep2Async(userId, body));
    }

    [HttpPost("step3")]
    [Authorize]
    public async Task<IActionResult> SubmitStep3([FromBody] StepThreeRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep3Async(userId, body));
    }

    [HttpPost("step4")]
    [Authorize]
    public async Task<IActionResult> SubmitStep4([FromBody] StepFourRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep4Async(userId, body));
    }

    [HttpPost("step5")]
    [Authorize]
    public async Task<IActionResult> SubmitStep5([FromBody] StepFiveRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep5Async(userId, body));
    }

    [HttpPost("step6")]
    [Authorize]
    public async Task<IActionResult> SubmitStep6([FromBody] StepSixRequest body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        return await ExecuteWithResult(() => _onboardingService.CompleteStep6Async(userId, body));
    }
}
