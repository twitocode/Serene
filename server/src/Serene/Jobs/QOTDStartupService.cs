using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;

namespace Serene.Jobs;

public class QOTDStartupService : IHostedService
{
    private readonly ILogger<QOTDStartupService> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly ISchedulerFactory _schedulerFactory;

    public QOTDStartupService(
        ILogger<QOTDStartupService> logger,
        IServiceProvider serviceProvider,
        ISchedulerFactory schedulerFactory
    )
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _schedulerFactory = schedulerFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var communityService = scope.ServiceProvider.GetRequiredService<ICommunityService>();

            var todayQOTD = await communityService.GetQOTDAsync(null);

            if (todayQOTD == null)
            {
                _logger.LogInformation("No QOTD found for today, creating one now");
                await communityService.CreateNewQOTD();
            }
            else
            {
                _logger.LogInformation("QOTD already exists for today");
            }

            // checks when the next QOTD job is scheduled
            var scheduler = await _schedulerFactory.GetScheduler(cancellationToken);
            var jobKey = new JobKey("SendQOTDJob");
            var triggers = await scheduler.GetTriggersOfJob(jobKey, cancellationToken);

            if (triggers.Any())
            {
                var nextFireTime = triggers.First().GetNextFireTimeUtc();
                if (nextFireTime.HasValue)
                {
                    _logger.LogInformation(
                        "Next QOTD job scheduled for: {time}",
                        nextFireTime.Value
                    );
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during QOTD startup check");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
