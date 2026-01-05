using Google.GenAI;
using Google.GenAI.Types;

namespace Serene.Services;
public interface IGeminiService
{
    Task<string> GetDailyQuestionAsync();
}

public class GeminiService(Client genAiClient, ILogger<GeminiService> logger) : IGeminiService
{
    private readonly Client _client = genAiClient;
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
            """;

        try 
        {
            var response = await _client.Models.GenerateContentAsync(
                model: "gemini-2.0-flash-lite", 
                contents: "Generate the question of the day", 
                config: new GenerateContentConfig
                {
                    SystemInstruction = new Content
                    {
                        Parts = [
                            new Part { Text = systemPrompt },
                            new Part { Text = "Whenever you are asked to generate a question of the day. Respond with JUST the question. nothing else" }
                        ]
                    }
                }
            );

            string? text = response?.Candidates?[0]?.Content?.Parts?[0]?.Text;

            if (string.IsNullOrWhiteSpace(text))
            {
                 _logger.LogWarning("Gemini returned empty response");
                 return "What is one small thing you can do for yourself today?";
            }

            _logger.LogInformation("GEMINI RESPONSE: {response}", text);
            return text;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating QOTD from Gemini");
            return "What is one small thing you can do for yourself today?";
        }
    }
}