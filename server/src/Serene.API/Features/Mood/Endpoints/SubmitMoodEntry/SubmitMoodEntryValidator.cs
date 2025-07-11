using FluentValidation;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Mood.Endpoints.SubmitMoodEntry;

public sealed class SubmitMoodEntryValidator : AbstractValidator<SubmitMoodEntryRequest>
{
    public SubmitMoodEntryValidator()
    {
        RuleFor(x => x.OverallMood)
            .IsEnumName(typeof(MoodType))
            .NotEmpty();

        RuleFor(x => x.EnergyLevel)
            .IsEnumName(typeof(EnergyLevelType))
            .NotEmpty();

        RuleFor(x => x.BestPartOfDay)
            .MaximumLength(250);

        RuleFor(x => x.WorstPartOfDay)
            .MaximumLength(250);


        RuleFor(x => x.HadPhysicalOrEmotionalDiscomfort)
            .NotEmpty();
    }
}