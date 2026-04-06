using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Serene.Features.Schools;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("admin/schools")]
public class AdminSchoolController : BaseApiController
{
    private readonly ISchoolService _schoolService;

    public AdminSchoolController(
        ISchoolService schoolService,
        ILogger<AdminSchoolController> logger
    )
        : base(logger)
    {
        _schoolService = schoolService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllSchools()
    {
        return await ExecuteWithResult(() => _schoolService.GetAllSchoolsAsync());
    }

    [HttpPost("instantiate")]
    public async Task<IActionResult> InstantiateSchool([FromBody] InstantiateSchoolRequest request)
    {
        return await ExecuteWithResult(() => _schoolService.InstantiateSchoolAsync(request));
    }

    [HttpPost("{schoolId}/resources")]
    public async Task<IActionResult> AddSchoolResource(
        string schoolId,
        [FromBody] CreateSchoolResourceRequest request
    )
    {
        return await ExecuteWithResult(() =>
            _schoolService.AddSchoolResourceAsync(schoolId, request)
        );
    }

    [HttpDelete("resources/{resourceId}")]
    public async Task<IActionResult> DeleteSchoolResource(string resourceId)
    {
        return await ExecuteWithResult(async () =>
        {
            await _schoolService.DeleteSchoolResourceAsync(resourceId);
            return new { success = true };
        });
    }
}
