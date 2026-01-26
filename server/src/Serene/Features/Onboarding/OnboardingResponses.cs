using NodaTime;

namespace Serene.Features.Onboarding;

public class OnboardingStatusResponse
{
    public int Step { get; set; }
    public bool Completed { get; set; }
    public bool Started { get; set; }

    // User Info
    public string? Name { get; set; }
    public LocalDate? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Pronouns { get; set; }
    public string? CountryCode { get; set; }

    // School Info
    public string? SchoolName { get; set; }

    // Mochi Info
    public string? MochiName { get; set; }
    public string? MochiPronouns { get; set; }
    public List<string> Struggles { get; set; } = new List<string>();
}
