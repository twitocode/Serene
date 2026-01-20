using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using NodaTime;
using Serene.Data;
using Serene.Entities;

namespace Serene.Services;

public interface IQuestionCache
{
    Task<QuestionOfTheDay?> GetQuestionAsync(LocalDate date);
    void SetQuestion(LocalDate date, QuestionOfTheDay question);
    void Invalidate(LocalDate date);
}

public class QuestionCache(IMemoryCache cache, ApplicationDbContext context) : IQuestionCache
{
    private const string KeyPrefix = "qotd:";

    public async Task<QuestionOfTheDay?> GetQuestionAsync(LocalDate date)
    {
        var key = $"{KeyPrefix}{date}";
        if (cache.TryGetValue(key, out QuestionOfTheDay? question))
        {
            return question;
        }

        question = await context.QuestionsOfTheDay
            .AsNoTracking()
            .FirstOrDefaultAsync(q => q.Day == date);

        if (question != null)
        {
            SetQuestion(date, question);
        }

        return question;
    }

    public void SetQuestion(LocalDate date, QuestionOfTheDay question)
    {
        var key = $"{KeyPrefix}{date}";
        cache.Set(key, question, TimeSpan.FromHours(24));
    }

    public void Invalidate(LocalDate date)
    {
        var key = $"{KeyPrefix}{date}";
        cache.Remove(key);
    }
}
