using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.Entities;
using Serene.Features.AI;

namespace Serene.Services;

public interface IQuestionPreparationService
{
    Task PrepareQuestionsForRangeAsync(LocalDate start, LocalDate end);
    Task PrepareEmergencyQuestionAsync(LocalDate date);
}

public class QuestionPreparationService(
    ApplicationDbContext context,
    IAIService aiService,
    IQuestionBankService bankService,
    ILogger<QuestionPreparationService> logger
) : IQuestionPreparationService
{
    public async Task PrepareQuestionsForRangeAsync(LocalDate start, LocalDate end)
    {
        for (var date = start; date <= end; date = date.PlusDays(1))
        {
            var exists = await context.QuestionsOfTheDay.AnyAsync(q => q.Day == date);
            if (!exists)
            {
                await GenerateForDateAsync(date);
            }
        }
    }

    public async Task PrepareEmergencyQuestionAsync(LocalDate date)
    {
        var exists = await context.QuestionsOfTheDay.AnyAsync(q => q.Day == date);
        if (exists)
            return;

        logger.LogInformation("Generating emergency question for {Date}", date);
        await GenerateForDateAsync(date);
    }

    private async Task GenerateForDateAsync(LocalDate date)
    {
        string? questionText = null;
        QuestionSourceType sourceType = QuestionSourceType.AiGenerated;
        string? sourceId = null;
        string? backupId = null;

        try
        {
            questionText = await aiService.GetDailyQuestionAsync();
            var backup = await bankService.GetUnusedQuestionAsync();
            backupId = backup?.Id;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "AI question generation failed for {Date}", date);
        }

        if (string.IsNullOrWhiteSpace(questionText))
        {
            var bankQuestion = await bankService.GetUnusedQuestionAsync();
            if (bankQuestion != null)
            {
                questionText = bankQuestion.Question;
                sourceType = QuestionSourceType.BankSelected;
                sourceId = bankQuestion.Id;
                backupId = bankQuestion.Id;
                await bankService.IncrementUsageCountAsync(bankQuestion.Id);
            }
        }

        if (string.IsNullOrWhiteSpace(questionText))
        {
            logger.LogCritical(
                "Failed to provide a question for {Date} even with bank fallback",
                date
            );
            return;
        }

        var qotd = new QuestionOfTheDay
        {
            Question = questionText,
            Day = date,
            SourceType = sourceType,
            SourceId = sourceId,
            BackupQuestionId = backupId,
            GenerationStatus = GenerationStatus.Completed,
            CreatedAt = SystemClock.Instance.GetCurrentInstant(),
            UpdatedAt = SystemClock.Instance.GetCurrentInstant(),
        };

        context.QuestionsOfTheDay.Add(qotd);
        await context.SaveChangesAsync();
    }
}
