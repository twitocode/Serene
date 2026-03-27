using Serene.Features.Checkins;

namespace Serene.Features.AI;

public interface IAIService
{
    Task<string> GetDailyQuestionAsync();
    Task<ReframeResponse> ReframeLingering(string lingeringThoughts);
}
