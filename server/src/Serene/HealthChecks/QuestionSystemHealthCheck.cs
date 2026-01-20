using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using NodaTime;
using Serene.Data;
using Serene.Entities;

namespace Serene.HealthChecks;

public class QuestionSystemHealthCheck(ApplicationDbContext dbContext) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
            var nextWeek = today.PlusDays(7);

            var questionCount = await dbContext.QuestionsOfTheDay
                .CountAsync(q => q.Day >= today && q.Day <= nextWeek, cancellationToken);

            var bankCount = await dbContext.QuestionBanks
                .CountAsync(q => q.IsActive, cancellationToken);

            var data = new Dictionary<string, object>
            {
                ["questions_next_7_days"] = questionCount,
                ["active_bank_questions"] = bankCount
            };

            if (questionCount >= 7)
            {
                return HealthCheckResult.Healthy("Question system is healthy", data);
            }

            if (questionCount > 0 || bankCount > 5)
            {
                return HealthCheckResult.Degraded("Question system has low coverage", null, data);
            }

            return HealthCheckResult.Unhealthy("Question system is critical: no questions for coming week", null, data);
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Question system check failed", ex);
        }
    }
}
