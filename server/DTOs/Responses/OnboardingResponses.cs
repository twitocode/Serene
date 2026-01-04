namespace Serene.DTOs;

public class OnboardingStatusResponse
{
    public int Step { get; set; }
    public bool Completed { get; set; }
    public bool Started { get; set; }
    
    // User Info
    public string? Name { get; set; }
    public int Age { get; set; }
    public string? Gender { get; set; }
    public string? Pronouns { get; set; }
    public string? CountryCode { get; set; }
    
    // School Info
    public string? SchoolName { get; set; }
    
    // Koala Info
    public string? KoalaName { get; set; }
    public string? KoalaColour { get; set; }
    public string? KoalaPronouns { get; set; }
}
