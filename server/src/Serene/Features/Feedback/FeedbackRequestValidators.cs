using FluentValidation;

namespace Serene.Features.Feedback;

public class FeedbackRequestValidator : AbstractValidator<FeedbackRequest>
{
    public FeedbackRequestValidator()
    {
        //TODO: make it so that it does not send on client but tell user that it sends
        RuleFor(x => x.Message)
            .MaximumLength(1000)
            .WithMessage("Maximum of 1000 characters in your response")
            .NotEmpty()
            .WithMessage("Provide a message for feedback");
    }
}
