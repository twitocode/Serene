using System.Text.Json;
using OpenAI.Chat;
using Serene.Features.Checkins;

namespace Serene.Features.AI;

public class OpenAIService(ChatClient genAiClient, ILogger<GeminiService> logger) : IAIService
{
    private static readonly JsonSerializerOptions ReframeJsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        AllowTrailingCommas = true,
        ReadCommentHandling = JsonCommentHandling.Skip,
    };

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
            ChatCompletion? response = await _client.CompleteChatAsync(
                systemPrompt + " Generate the question of the day"
            );

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

    public async Task<ReframeResponse> ReframeLingering(string lingeringThoughts)
    {
        const string systemPrompt = """
            You are Mochi, a gentle AI wellness companion for university students.
            You are NOT a therapist, doctor, or licensed professional. You are a supportive tool 
            that helps students practice cognitive reframing as a wellness exercise.

            TASK: Analyse the student's thought and respond with ONLY valid JSON (no markdown, no code fences).

            INSTRUCTIONS:
            1. Identify the single most prominent cognitive distortion from this list:
               Catastrophizing, Overgeneralization, Mind-Reading, Fortune-Telling,
               Black-and-White Thinking, Emotional Reasoning, Should Statements,
               Personalization, Labeling, Discounting the Positive, Magnification
            2. Write one short, warm Socratic question (1-2 sentences) that gently 
               challenges the thought without invalidating the student's feelings.
            3. Suggest a balanced alternative thought (1-2 sentences). Avoid toxic positivity,
               but offer a genuinely kinder and more realistic perspective.

            SAFETY: If the input mentions self-harm, suicide, or imminent danger, 
            return: {"distortion":"Crisis","socraticQuestion":"","suggestedReframe":"Please reach out to a crisis helpline or trusted person right now. You deserve support."}

            RESPONSE FORMAT (strict JSON, nothing else):
            {"distortion":"<name>","socraticQuestion":"<question>","suggestedReframe":"<reframe>"}
            """;

        var fallback = new ReframeResponse
        {
            Distortion = "Unknown",
            SocraticQuestion = "What evidence do you have for and against this thought?",
            SuggestedReframe =
                "It's okay to feel this way. Consider whether there's a more balanced perspective.",
        };

        try
        {
            _logger.LogInformation("Reframing lingering thoughts");

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(systemPrompt),
                new UserChatMessage(lingeringThoughts),
            };

            ChatCompletion? response = await _client.CompleteChatAsync(messages);

            if (response == null || response.Content.Count == 0)
            {
                _logger.LogWarning("OpenAI returned empty response for reframe");
                return fallback;
            }

            string text = string.Join(
                    string.Empty,
                    response.Content.Select(static c => c.Text ?? string.Empty)
                )
                .Trim();

            _logger.LogInformation("Reframe response: {response}", text);

            string jsonPayload = ExtractJsonObject(text);
            var parsed = JsonSerializer.Deserialize<ReframeResponse>(
                jsonPayload,
                ReframeJsonOptions
            );

            if (
                parsed is null
                || string.IsNullOrWhiteSpace(parsed.Distortion)
                || string.IsNullOrWhiteSpace(parsed.SuggestedReframe)
            )
            {
                _logger.LogWarning(
                    "Reframe JSON parse incomplete after extraction. Payload length: {Len}",
                    jsonPayload.Length
                );
                return fallback;
            }

            return parsed;
        }
        catch (JsonException ex)
        {
            _logger.LogWarning(ex, "Invalid JSON from reframe model; using fallback");
            return fallback;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error reframing lingering thoughts");
            return fallback;
        }
    }

    /// <summary>
    /// Models often wrap JSON in markdown fences or add a short preamble; strip that so we can deserialize.
    /// </summary>
    private static string ExtractJsonObject(string raw)
    {
        ReadOnlySpan<char> s = raw.AsSpan().Trim();

        if (s.StartsWith("```", StringComparison.Ordinal))
        {
            int firstNl = s.IndexOf('\n');
            if (firstNl >= 0)
            {
                s = s[(firstNl + 1)..].Trim();
            }

            int fence = s.LastIndexOf("```", StringComparison.Ordinal);
            if (fence >= 0)
            {
                s = s[..fence].Trim();
            }
        }

        int start = s.IndexOf('{');
        int end = s.LastIndexOf('}');
        if (start >= 0 && end > start)
        {
            return s[start..(end + 1)].ToString();
        }

        return raw.Trim();
    }
}
