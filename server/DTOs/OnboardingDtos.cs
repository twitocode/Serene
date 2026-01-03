using System.ComponentModel.DataAnnotations;
using Reinforced.Typings.Exceptions;

namespace Serene.DTOs;

public class StepOneDto
{
    [Required(ErrorMessage = "Username was not provided")]
    [MinLength(2, ErrorMessage = "Username must be at least 2 characters")]
    [MaxLength(50, ErrorMessage = "Username must be at less than 50 characters")]
    [RegularExpression(@"^[a-zA-Z\s-]+$", ErrorMessage = "Username can only contain letters, spaces, hyphens")]
    public string Name { get; set; } = string.Empty;
}

public class StepTwoDto
{
    [Required(ErrorMessage = "Age was not provided")]
    [Range(13, 120, ErrorMessage = "Must be 18 years or older")]
    public int Age { get; set; }

    [Required(ErrorMessage = "Gender was not provided")]
    [RegularExpression("^(Male|Female|Non-Binary|Prefer not to say)$", ErrorMessage = "Please select a valid gender")]
    public string Gender { get; set; } = "Prefer not to say";

    [RegularExpression(@"^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$", ErrorMessage = "Invalid pronouns")]
    [Required(ErrorMessage = "Pronouns was not provided")]
    public string? Pronouns { get; set; }
}

public class StepThreeDto
{
    [Required(ErrorMessage = "Country Code was not provided")]
    [MinLength(2, ErrorMessage = "Provided an invalid country code")]
    public string CountryCode { get; set; } = string.Empty;
}

public class StepFourDto
{
    [Required(ErrorMessage = "School's name was not provided")]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "School's country code was not provided")]
    public string CountryCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "School's city was not provided")]
    public string City { get; set; } = string.Empty;

    [Required(ErrorMessage = "School's region code was not provided")]
    [StringLength(3)]
    public string RegionCode { get; set; } = string.Empty;
}

public class StepFiveDto
{
    [Required(ErrorMessage = "Koala's name was not provided")]
    [MinLength(2, ErrorMessage = "Koala's name must be at least 2 characters long")]
    [MaxLength(30, ErrorMessage = "Koala's name must be less than 30 characters long")]
    [RegularExpression(@"^[a-zA-Z\s'-]+$", ErrorMessage = "Koala name can only contain letters, spaces, hyphens, and apostrophes")]
    public string KoalaName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Koala's colour was not provided")]
    [RegularExpression(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", ErrorMessage = "Please select a valid color for your koala")]
    public string KoalaColour { get; set; } = "#5EEAD4";

    [Required(ErrorMessage = "Koala's pronouns was not provided")]
    [RegularExpression(@"^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$", ErrorMessage = "Invalid pronouns")]
    public string? KoalaPronouns { get; set; }
}
