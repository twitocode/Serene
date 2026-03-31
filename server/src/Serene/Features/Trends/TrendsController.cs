using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serene.Features.Shared;

namespace Serene.Features.Trends;

[ApiController]
[Route("trends")]
[Authorize]
public class TrendsController : BaseApiController
{
    private readonly ITrendsService _trendsService;

    public TrendsController(ITrendsService trendsService, ILogger<TrendsController> logger)
        : base(logger)
    {
        _trendsService = trendsService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTrends([FromQuery] int? year)
    {
        return await ExecuteWithResult(async () =>
        {
            var userId = GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User not authenticated");
            }

            var targetYear = year ?? DateTime.UtcNow.Year;
            return await _trendsService.GetTrendsAsync(userId, targetYear);
        });
    }
}
