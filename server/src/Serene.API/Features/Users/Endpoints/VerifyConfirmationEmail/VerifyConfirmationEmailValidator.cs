using FluentValidation;

namespace Serene.API.Features.Users.Endpoints.VerifyConfirmationEmail;

public class VerifyConfirmationEmailValidator : AbstractValidator<VerifyConfirmationEmailRequest>
{
    public VerifyConfirmationEmailValidator()
    {
        RuleFor(x => x.Code).Length(6).NotNull();
    }
}