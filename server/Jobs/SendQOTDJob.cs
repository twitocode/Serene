using Quartz;
using Serene.Services;

namespace Serene.Jobs;

public class SendQOTDJob : IJob
{
    private readonly ILogger<SendQOTDJob> _logger;
    private readonly ICommunityService _communityService;

    public SendQOTDJob(ILogger<SendQOTDJob> logger, ICommunityService communityService)
    {
        _logger = logger;
        _communityService = communityService;
    }

    public async Task Execute(IJobExecutionContext context)
    { 
        await _communityService.CreateNewQOTD();
    }
}
