using FluentValidation;
using Serene.Entities;

namespace Serene.Features.Checkins;

public class CompleteCheckinRequestValidator : AbstractValidator<CompleteCheckinRequest>
{
    public CompleteCheckinRequestValidator()
    {
        //TODO: have a custom list of labels
        RuleFor(x => x.MoodLabel).NotEmpty().WithMessage("You did not enter in a mood label");
        RuleFor(x => x.PromptQuestion)
            .NotEmpty()
            .WithMessage("You did not provide a prompt question");
        RuleFor(x => x.LingeringThoughts)
            .MaximumLength(2000)
            .WithMessage("Lingering thoughts is too long, max 2000 characters");
        RuleFor(x => x.PromptAnswer)
            .MaximumLength(2000)
            .WithMessage("Prompt answer is too long, max 2000 characters");
        RuleFor(x => x.MoodSeverity)
            .InclusiveBetween(1, 10)
            .WithMessage("Mood severity must be between 1 and 10 inclusive")
            .NotEmpty()
            .WithMessage("You did not provide a mood severity");
        RuleForEach(x => x.SomaticState.Values).SetValidator(new GridPointValidator());
    }
}

public class GridPointValidator : AbstractValidator<GridPoint>
{
    public GridPointValidator()
    {
        RuleFor(x => x.X)
            .InclusiveBetween(0, 1)
            .WithMessage("X coordinate must be normalized between 0 and 1.");

        RuleFor(x => x.Y)
            .InclusiveBetween(0, 1)
            .WithMessage("Y coordinate must be normalized between 0 and 1.");

        //TODO: preset senssations
        RuleForEach(x => x.Sensations)
            .MaximumLength(200)
            .WithMessage("Sensation length is too long");
    }
}
