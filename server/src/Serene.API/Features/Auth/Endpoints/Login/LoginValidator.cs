using FluentValidation;

namespace Serene.API.Features.Auth.Endpoints.Login;

public class LoginRequestValidator : AbstractValidator<Microsoft.AspNetCore.Identity.Data.LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty().MinimumLength(6).MaximumLength(30);
    }
}