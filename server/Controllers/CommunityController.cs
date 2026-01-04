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
[Authorize]
public class CommunityController : BaseApiController
{
    private readonly ICommunityService _commnityService;

    public CommunityController(ICommunityService commnityService, ILogger<CommunityController> logger) : base(logger)
    {
        _commnityService = commnityService;
    }


    [HttpPost("post/{qotdId}")]
    public async Task<IActionResult> CheckEmail([FromBody] CheckEmailRequest dto, [FromRoute] string qotdId)
    {
        return await ExecuteWithResult(() =>
        {
            _commnityService.
        });
    }
}