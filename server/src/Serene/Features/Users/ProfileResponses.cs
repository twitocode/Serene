namespace Serene.Features.Users;

public class ProfileResponse
{
    public string Id { get; set; } = string.Empty;
    public string? KoalaName { get; set; } = string.Empty;
    public string? KoalaColour { get; set; } = string.Empty;
    public string? KoalaPronouns { get; set; } = string.Empty;
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }

    public string UserId { get; set; } = string.Empty;
    public SchoolResponse? School { get; set; }
}