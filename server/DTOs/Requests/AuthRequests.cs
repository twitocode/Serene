using System.ComponentModel.DataAnnotations;

namespace Serene.DTOs;

public class EmailSignUpRequest
{
    [Required(ErrorMessage = "You did not enter in an email")]
    [EmailAddress(ErrorMessage = "Enter a valid email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "You did not enter in a password")]
    [MinLength(length:8, ErrorMessage ="Password must be at least 8 characters long")]
    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "You did not enter in a name")]
    [MinLength(2)]
    public string Name { get; set; } = string.Empty;
}

public class EmailSignInRequest
{
    [Required(ErrorMessage = "You did not enter in an email")]
    [EmailAddress(ErrorMessage = "Enter a valid email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "You did not enter in a password")]
    public string Password { get; set; } = string.Empty;
}

public class CheckEmailRequest
{
    [Required(ErrorMessage = "You did not enter in an email")]
    [EmailAddress(ErrorMessage = "Enter a valid email")]
    public string Email { get; set; } = string.Empty;
}

public class GoogleLoginRequest
{
    [Required(ErrorMessage = "Google ID token not provided")]
    public string IdToken { get; set; } = string.Empty;
}