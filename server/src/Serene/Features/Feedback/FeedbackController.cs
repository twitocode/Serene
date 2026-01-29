using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Serene.Common;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Feedback;

[ApiController]
[Route("feedback")]
public class FeedbackController : BaseApiController
{
    private readonly IFeedbackService _feedbackService;

    public FeedbackController(IFeedbackService feedbackService, ILogger<FeedbackController> logger)
        : base(logger)
    {
        _feedbackService = feedbackService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> SendFeedback([FromBody] FeedbackRequest dto)
    {
        string? uid = GetUserId();

        if (uid == null)
            return Unauthorized();

        return await ExecuteWithResult(() => _feedbackService.SendAsync(dto, uid));
    }
}
