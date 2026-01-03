using System.ComponentModel.DataAnnotations;

namespace Serene.DTOs;

public class StepOneDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    [RegularExpression(@"^[a-zA-Z\s-]+$", ErrorMessage = "Name can only contain letters, spaces, hyphens")]
    public string Name { get; set; } = string.Empty;
}

public class StepTwoDto
{
    [Range(13, 120)]
    public int Age { get; set; }

    [Required]
    [RegularExpression("^(Male|Female|Non-Binary|Prefer not to say)$", ErrorMessage = "Please select a valid gender")]
    public string Gender { get; set; } = "Prefer not to say";

    [RegularExpression(@"^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$", ErrorMessage = "Invalid pronouns")]
    public string? Pronouns { get; set; }
}

public class StepThreeDto
{
    [Required]
    [MinLength(1)]
    public string CountryCode { get; set; } = string.Empty;
}

public class StepFourDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string CountryCode { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(3)]
    public string RegionCode { get; set; } = string.Empty;
}

public class StepFiveDto
{
    [Required]
    [MinLength(2)]
    [MaxLength(30)]
    [RegularExpression(@"^[a-zA-Z\s'-]+$", ErrorMessage = "Koala name can only contain letters, spaces, hyphens, and apostrophes")]
    public string KoalaName { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(Gray|Brown|White|Black|Cream|Tan)$", ErrorMessage = "Please select a color for your koala")]
    public string KoalaColour { get; set; } = "Gray";

    [MaxLength(50)]
    public string? KoalaPronouns { get; set; }
}
