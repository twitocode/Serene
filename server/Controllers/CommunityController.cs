using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.Common;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;
using Serene.Services;

namespace Serene.Controllers;

[ApiController]
[Route("community")]
public class CommunityController : BaseApiController
{
    private readonly ICommunityService _commnityService;

    public CommunityController(ICommunityService commnityService, ILogger<CommunityController> logger) : base(logger)
    {
        _commnityService = commnityService;
    }
    
    [Authorize]
    [HttpPost("qotd")]
    public async Task<IActionResult> AnswerQOTD([FromBody] QOTDPostRequest dto)
    {
        string? uid = GetUserId();
        if (uid == null) return Unauthorized();
        return await ExecuteWithResult(() => _commnityService.AnswerQOTDAsync(dto, uid));
    }

    [Authorize]
    [HttpGet("qotd")]
    public async Task<IActionResult> GetQOTD([FromQuery] string? date)
    {
        return await ExecuteWithResult(() => _commnityService.GetQOTDAsync(date));
    }

    [Authorize]
    [HttpGet("qotd/{date}/responses")]
    public async Task<IActionResult> GetQOTDResponses([FromRoute] string date)
    {
        return await ExecuteWithResult(() => _commnityService.GetResponsesAsync(date));
    }
}