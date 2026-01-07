using FluentValidation;
using Serene.DTOs;
using NodaTime;

namespace Serene.Validators;

public class StepOneRequestValidator : AbstractValidator<StepOneRequest>
{
    public StepOneRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Username was not provided")
            .MinimumLength(2).WithMessage("Username must be at least 2 characters")
            .MaximumLength(50).WithMessage("Username must be less than 50 characters")
            .Matches(@"^[a-zA-Z\s-]+$").WithMessage("Username can only contain letters, spaces, hyphens");
    }
}

public class StepTwoRequestValidator : AbstractValidator<StepTwoRequest>
{
    public StepTwoRequestValidator()
    {
        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth was not provided")
            .Must(BeAtLeast13YearsOld).WithMessage("Must be 13 years or older")
            .Must(BeReasonableAge).WithMessage("Please enter a valid date of birth");

        RuleFor(x => x.Gender)
            .NotEmpty().WithMessage("Gender was not provided")
            .Matches("^(Male|Female|Non-Binary|Prefer not to say)$").WithMessage("Please select a valid gender");

        RuleFor(x => x.Pronouns)
            .NotEmpty().WithMessage("Pronouns was not provided")
            .Matches(@"^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$").WithMessage("Invalid pronouns");
    }

    private bool BeAtLeast13YearsOld(LocalDate dateOfBirth)
    {
        var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        var age = today - dateOfBirth;
        return age.Years >= 13;
    }

    private bool BeReasonableAge(LocalDate dateOfBirth)
    {
        var today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        var age = today - dateOfBirth;
        return age.Years >= 0 && age.Years <= 120;
    }
}

public class StepThreeRequestValidator : AbstractValidator<StepThreeRequest>
{
    public StepThreeRequestValidator()
    {
        RuleFor(x => x.CountryCode)
            .NotEmpty().WithMessage("Country Code was not provided")
            .MinimumLength(2).WithMessage("Provided an invalid country code");
    }
}

public class StepFourRequestValidator : AbstractValidator<StepFourRequest>
{
    public StepFourRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("School's name was not provided")
            .MinimumLength(2).WithMessage("School's name must be at least 2 characters")
            .MaximumLength(100).WithMessage("School's name must be less than 100 characters");

        RuleFor(x => x.CountryCode)
            .NotEmpty().WithMessage("School's country code was not provided");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("School's city was not provided");

        RuleFor(x => x.RegionCode)
            .NotEmpty().WithMessage("School's region code was not provided")
            .Length(2).WithMessage("Region code must be exactly 2 characters");
    }
}

public class StepFiveRequestValidator : AbstractValidator<StepFiveRequest>
{
    public StepFiveRequestValidator()
    {
        RuleFor(x => x.KoalaName)
            .NotEmpty().WithMessage("Koala's name was not provided")
            .MinimumLength(2).WithMessage("Koala's name must be at least 2 characters long")
            .MaximumLength(30).WithMessage("Koala's name must be less than 30 characters long")
            .Matches(@"^[a-zA-Z\s'-]+$").WithMessage("Koala name can only contain letters, spaces, hyphens, and apostrophes");

        RuleFor(x => x.KoalaColour)
            .NotEmpty().WithMessage("Koala's colour was not provided")
            .Matches(@"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$").WithMessage("Please select a valid color for your koala");

        RuleFor(x => x.KoalaPronouns)
            .NotEmpty().WithMessage("Koala's pronouns was not provided")
            .Matches(@"^(She\s?[\/\-]\s?Her|He\s?[\/\-]\s?Him|They\s?[\/\-]\s?Them|Prefer not to say)$").WithMessage("Invalid pronouns");
    }
}