using FluentValidation;

namespace Serene.Features.Auth;

public class EmailSignUpRequestValidator : AbstractValidator<EmailSignUpRequest>
{
    public EmailSignUpRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("You did not enter in an email")
            .EmailAddress()
            .WithMessage("Enter a valid email");

        RuleFor(x => x.Password)
            .NotEmpty()
            .WithMessage("You did not enter in a password")
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 characters long");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("You did not enter in a name")
            .MinimumLength(2)
            .WithMessage("Name must be at least 2 characters long");
    }
}

public class EmailSignInRequestValidator : AbstractValidator<EmailSignInRequest>
{
    public EmailSignInRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("You did not enter in an email")
            .EmailAddress()
            .WithMessage("Enter a valid email");

        RuleFor(x => x.Password).NotEmpty().WithMessage("You did not enter in a password");
    }
}

public class CheckEmailRequestValidator : AbstractValidator<CheckEmailRequest>
{
    public CheckEmailRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("You did not enter in an email")
            .EmailAddress()
            .WithMessage("Enter a valid email");
    }
}

public class GoogleLoginRequestValidator : AbstractValidator<GoogleLoginRequest>
{
    public GoogleLoginRequestValidator()
    {
        RuleFor(x => x.IdToken).NotEmpty().WithMessage("Google ID token not provided");
    }
}
