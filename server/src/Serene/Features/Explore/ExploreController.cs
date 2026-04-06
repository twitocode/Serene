using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Serene.Features.Explore;

[ApiController]
[Route("explore")]
public class ExploreController : BaseApiController
{
    private readonly IExploreService _exploreService;

    public ExploreController(IExploreService exploreService, ILogger<ExploreController> logger)
        : base(logger)
    {
        _exploreService = exploreService;
    }

    [HttpGet("recommendations")]
    [Authorize]
    public async Task<IActionResult> GetRecommendations()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        return await ExecuteWithResult(() => _exploreService.GetRecommendationsAsync(userId));
    }

    [HttpGet("school")]
    [Authorize]
    public async Task<IActionResult> GetSchoolResources()
    {
        var userId = GetUserId();
        if (userId == null)
            return Unauthorized();

        return await ExecuteWithResult(() => _exploreService.GetSchoolResourcesAsync(userId));
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllContent()
    {
        return await ExecuteWithResult(() => _exploreService.GetAllContentAsync());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddContent([FromBody] CreateExploreContentRequest request)
    {
        return await ExecuteWithResult(async () =>
        {
            var id = await _exploreService.AddContentAsync(request);
            return new { id };
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateContent(
        string id,
        [FromBody] CreateExploreContentRequest request
    )
    {
        return await ExecuteWithResult(async () =>
        {
            await _exploreService.UpdateContentAsync(id, request);
            return new { success = true };
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteContent(string id)
    {
        return await ExecuteWithResult(async () =>
        {
            await _exploreService.DeleteContentAsync(id);
            return new { success = true };
        });
    }

    [HttpDelete("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllContent()
    {
        return await ExecuteWithResult(async () =>
        {
            await _exploreService.DeleteAllContentAsync();
            return new { success = true };
        });
    }

    [HttpPost("scrape")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ScrapeContent([FromBody] ScrapeRequest request)
    {
        return await ExecuteWithResult(() => _exploreService.ScrapeContentAsync(request.Url));
    }

    [HttpPost("populate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PopulateFromSearch([FromBody] PopulateExploreRequest request)
    {
        return await ExecuteWithResult(() =>
            _exploreService.PopulateFromSearchAsync(request.Query, request.Count)
        );
    }
}
