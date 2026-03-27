using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.Common;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Community;

[ApiController]
[Route("community")]
public class CommunityController : BaseApiController
{
    private readonly ICommunityService _commnityService;
    private readonly IPeerMatchService _peerMatchService;

    public CommunityController(
        ICommunityService commnityService,
        IPeerMatchService peerMatchService,
        ILogger<CommunityController> logger
    )
        : base(logger)
    {
        _commnityService = commnityService;
        _peerMatchService = peerMatchService;
    }

    [Authorize]
    [HttpPost("qotd")]
    public async Task<IActionResult> AnswerQOTD([FromBody] QOTDPostRequest dto)
    {
        string? uid = GetUserId();
        if (uid == null)
            return Unauthorized();
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

    [HttpGet("interests")]
    [Authorize]
    public async Task<IActionResult> GetInterests()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();
        return await ExecuteWithResult(() => _peerMatchService.GetInterestsAsync(userId));
    }

    [HttpPost("interests")]
    [Authorize]
    public async Task<IActionResult> UpdateInterests([FromBody] UpdateInterestsRequest body)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();
        return await ExecuteWithResult(() =>
            _peerMatchService.UpdateInterestsAsync(userId, body.Interests)
        );
    }

    [HttpGet("peers/match")]
    [Authorize]
    public async Task<IActionResult> GetPeerMatch()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();
        return await ExecuteWithResult(() => _peerMatchService.GetCurrentMatchAsync(userId));
    }
}
