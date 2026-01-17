using FluentValidation;
using Serene.DTOs;

namespace Serene.Validators;

public class QOTDPostRequestValidator : AbstractValidator<QOTDPostRequest>
{
    public QOTDPostRequestValidator()
    {
        RuleFor(x => x.QOTDId)
            .NotEmpty().WithMessage("Provide a QOTD Id");

        RuleFor(x => x.Response)
            .NotEmpty().WithMessage("Did not provide a response to the question");
    }
}