using System.Text.RegularExpressions;
using FluentValidation;

namespace Serene.API.Features.Auth.Endpoints.Register;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("Email is required.")
            .Must(BeAValidEmailAddress)
            .WithMessage("Invalid email address.");

        RuleFor(x => x.Password)
            .NotEmpty().MinimumLength(6).MaximumLength(30);
    }
        
    private bool BeAValidEmailAddress(string email)
    {
        // Basic regex for email validation (can be replaced with a more robust one)
        string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        return Regex.IsMatch(email, pattern);
    }
}