using NodaTime;
using Reinforced.Typings.Exceptions;
using System.ComponentModel.DataAnnotations;

namespace Serene.DTOs;

public class StepOneRequest
{
    public string Name { get; set; } = string.Empty;
}

public class StepTwoRequest
{
    public LocalDate DateOfBirth { get; set; }
    public string Gender { get; set; } = "Prefer not to say";
    public string? Pronouns { get; set; }
}

public class StepThreeRequest
{
    public string CountryCode { get; set; } = string.Empty;
}

public class StepFourRequest
{
    public string Name { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string RegionCode { get; set; } = string.Empty;
}

public class StepFiveRequest
{
    public string KoalaName { get; set; } = string.Empty;
    public string KoalaColour { get; set; } = "#5EEAD4";
    public string? KoalaPronouns { get; set; }
}

public class StepSixRequest
{
    public List<string> Struggles { get; set; } = new List<string>();
}