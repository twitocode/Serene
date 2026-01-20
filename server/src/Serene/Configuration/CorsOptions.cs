namespace Serene.Configuration;

public class CorsOptions
{
    public const string SectionName = "Cors";

    public string[] Origins { get; set; } = Array.Empty<string>();
}
