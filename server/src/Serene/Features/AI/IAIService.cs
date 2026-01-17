namespace Serene.Features.AI;

public interface IAIService
{
    Task<string> GetDailyQuestionAsync();
}