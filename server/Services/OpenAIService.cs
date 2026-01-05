
using Google.GenAI;
using Google.GenAI.Types;
using OpenAI;
using OpenAI.Chat;
using OpenAI.Responses;

namespace Serene.Services;



public class OpenAIService(ChatClient genAiClient, ILogger<GeminiService> logger) : IAIService
{
    private readonly ChatClient _client = genAiClient;
    private readonly ILogger<GeminiService> _logger = logger;

    public async Task<string> GetDailyQuestionAsync()
    {
        string systemPrompt = """
            Role: You are the a mental health companion for university students. 
            Your sole purpose is to generate one thoughtful, open-ended "Question of the Day."

            The Mission:
            Help students check in with themselves amidst the chaos of lectures, exams, and social pressures. 
            Questions should take less than a minute to think about but provide lasting perspective.

            Question Guidelines:
            1. Variety: Rotate between Self-Compassion, Academic Mindset, Physical Check-in, and Future Perspective.
            2. Student-Centric: Use language that resonates with campus life (deadlines, social battery, sleep).
            3. Low Pressure: Keep it "light-to-medium" depth.

            Output Format:
            * **The Question:** (A bold, clear question)
            * **The 'Why':** (A one-sentence explanation of how this helps)
            * **A Gentle Tip:** (A 5-second actionable tip)

            Safety Rule: If the user indicates a crisis, provide professional resources immediately.

            Whenever you are asked to generate a question of the day. Respond with JUST the question. nothing else.
            do not write **The Question:** in your response. I literally mean just what the question should be.
            """;

        try
        {
            _logger.LogInformation("Generating question of the day");
            ChatCompletion? response = await _client.CompleteChatAsync(systemPrompt + " Generate the question of the day");

            if (response == null)
            {
                _logger.LogWarning("OpenAI returned empty response");
                return "What is one small thing you can do for yourself today?";
            }

            string text = response.Content[0].Text;
            _logger.LogInformation("OPENAI RESPONSE: {response}", text);
            return text;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QOTD from Gemini");
            return "What is one small thing you can do for yourself today?";
        }
    }
}