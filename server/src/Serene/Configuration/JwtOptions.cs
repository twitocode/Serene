namespace Serene.Configuration;

public class JwtOptions
{
    public const string SectionName = "Authentication:Jwt";

    public string Authority { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
}
