using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Serene.Features.Schools;

[Authorize]
[ApiController]
[Route("schools")]
public class SchoolController : BaseApiController
{
    private readonly ISchoolService _schoolService;

    public SchoolController(ISchoolService schoolService, ILogger<SchoolController> logger)
        : base(logger)
    {
        _schoolService = schoolService;
    }

    [HttpGet("my-school")]
    public async Task<IActionResult> GetMySchool()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        return await ExecuteWithResult(() => _schoolService.GetSchoolByUserIdAsync(userId));
    }

    [HttpPut("my-school")]
    public async Task<IActionResult> UpdateMySchool([FromBody] InstantiateSchoolRequest request)
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        return await ExecuteWithResult(() => _schoolService.UpdateUserSchoolAsync(userId, request));
    }

    [HttpPost("{schoolId}/clubs")]
    public async Task<IActionResult> AddSchoolClub(
        string schoolId,
        [FromBody] CreateSchoolClubRequest request
    )
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        return await ExecuteWithResult(() =>
            _schoolService.AddSchoolClubAsync(schoolId, userId, request)
        );
    }
}
