using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.Entities;

namespace Serene.Services;

public interface IQuestionBankService
{
    Task<QuestionBank?> GetUnusedQuestionAsync();
    Task IncrementUsageCountAsync(string questionId);
    Task AddQuestionAsync(string question, string? category = null);
    Task<IEnumerable<QuestionBank>> GetQuestionsByCategoryAsync(string category);
}

public class QuestionBankService(ApplicationDbContext context) : IQuestionBankService
{
    public async Task<QuestionBank?> GetUnusedQuestionAsync()
    {
        return await context
            .QuestionBanks.Where(q => q.IsActive)
            .OrderBy(q => q.UsedCount)
            .ThenBy(_ => Guid.NewGuid())
            .FirstOrDefaultAsync();
    }

    public async Task IncrementUsageCountAsync(string questionId)
    {
        var question = await context.QuestionBanks.FindAsync(questionId);
        if (question != null)
        {
            question.UsedCount++;
            await context.SaveChangesAsync();
        }
    }

    public async Task AddQuestionAsync(string question, string? category = null)
    {
        var bankQuestion = new QuestionBank
        {
            Question = question,
            Category = category,
            IsAiGenerated = false,
            CreatedAt = SystemClock.Instance.GetCurrentInstant(),
            UsedCount = 0,
            IsActive = true,
        };

        context.QuestionBanks.Add(bankQuestion);
        await context.SaveChangesAsync();
    }

    public async Task<IEnumerable<QuestionBank>> GetQuestionsByCategoryAsync(string category)
    {
        return await context
            .QuestionBanks.Where(q => q.Category == category && q.IsActive)
            .OrderBy(q => q.UsedCount)
            .ToListAsync();
    }
}
