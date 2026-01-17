using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NodaTime;
using Serene.Data;
using Serene.DTOs;
using Serene.Entities;
using Serene.Services;
using System.Security.Claims;

namespace Serene.Controllers;


[ApiController]
[Route("preferences")]
public class PreferencesController : BaseApiController
{
    private readonly IPreferencesService _preferencesService;

    public PreferencesController(IPreferencesService preferencesService, ILogger<PreferencesController> logger) : base(logger)
    {
        _preferencesService = preferencesService;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUserPreferences()
    {
        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized(new { Success = false, Message = "User ID not found in token" });
        }

        return await ExecuteWithResult(async () =>
        {
            return await _preferencesService.GetUserPreferencesAsync(userId);
        });
    }


    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdatePreferences([FromBody] UpdatePreferencesDto dto)
    {
        return await ExecuteWithResult(async () =>
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId)) throw new UnauthorizedAccessException();

            return await _preferencesService.UpdatePreferencesAsync(userId, dto);
        });
    }

}