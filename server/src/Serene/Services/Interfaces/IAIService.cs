namespace Serene.Services;

public interface IAIService
{
    Task<string> GetDailyQuestionAsync();
}