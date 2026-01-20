using NodaTime;
using Quartz;
using Serene.Services;

namespace Serene.Jobs;

public class QuestionGenerationJob(
    IQuestionPreparationService preparationService,
    ILogger<QuestionGenerationJob> logger
) : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        try
        {
            logger.LogInformation("Starting question generation job");

            var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
            var end = today.PlusDays(14);

            await preparationService.PrepareQuestionsForRangeAsync(today, end);

            logger.LogInformation("Question generation job completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Question generation job failed");
        }
    }
}
