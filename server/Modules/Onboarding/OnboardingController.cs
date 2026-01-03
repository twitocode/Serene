using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serene.DTOs;
using Serene.Services;

namespace Serene.Modules.Onboarding;

[ApiController]
[Route("users/onboarding")]
public class OnboardingController : ControllerBase
{
    private readonly IOnboardingService _onboardingService;
    private readonly ILogger<OnboardingController> _logger;

    public OnboardingController(IOnboardingService onboardingService, ILogger<OnboardingController> logger)
    {
        _onboardingService = onboardingService;
        _logger = logger;
    }

    private string? GetUserId() => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetOnboardingStatus()
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        var status = await _onboardingService.GetStatusAsync(userId);
        return Ok(status);
    }

    [HttpPost("step1")]
    [Authorize]
    public async Task<IActionResult> SubmitStep1([FromBody] StepOneDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await _onboardingService.CompleteStep1Async(userId, body);
        return Ok(new { Success = true });
    }

    [HttpPost("step2")]
    [Authorize]
    public async Task<IActionResult> SubmitStep2([FromBody] StepTwoDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await _onboardingService.CompleteStep2Async(userId, body);
        return Ok(new { Success = true });
    }

    [HttpPost("step3")]
    [Authorize]
    public async Task<IActionResult> SubmitStep3([FromBody] StepThreeDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await _onboardingService.CompleteStep3Async(userId, body);
        return Ok(new { Success = true });
    }

    [HttpPost("step4")]
    [Authorize]
    public async Task<IActionResult> SubmitStep4([FromBody] StepFourDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await _onboardingService.CompleteStep4Async(userId, body);
        return Ok(new { Success = true });
    }

    [HttpPost("step5")]
    [Authorize]
    public async Task<IActionResult> SubmitStep5([FromBody] StepFiveDto body)
    {
        var userId = GetUserId();
        if (userId == null) return Unauthorized();

        await _onboardingService.CompleteStep5Async(userId, body);
        return Ok(new { Success = true });
    }
}
