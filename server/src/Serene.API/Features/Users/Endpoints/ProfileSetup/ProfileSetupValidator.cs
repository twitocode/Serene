using System.Globalization;
using System.Text.RegularExpressions;
using FluentValidation;
using Serene.API.Data;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Users.Endpoints.ProfileSetup;

public class ProfileSetupValidator : AbstractValidator<ProfileSetupRequest>
{
    public ProfileSetupValidator()
    {
        RuleFor(x => x.FirstName)
            .MaximumLength(20)
            .NotEmpty();

        RuleFor(x => x.LastName)
            .MaximumLength(30)
            .NotEmpty();

        RuleFor(x => x.Username)
            .MaximumLength(15)
            .NotEmpty();

        RuleFor(x => x.Country)
            .Must(country => DefaultData.Countries.Contains(country))
            .NotEmpty();

        RuleFor(x => x.AvatarUrl)
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .When(x => !string.IsNullOrEmpty(x.AvatarUrl));

        RuleFor(x => x.Pronouns)
            .Matches(_ =>
            {
                const string subjects = "(he|she|it|they)";
                const string objects = "(him|her|its|them)";

                return $"^{subjects}/{objects}$";
            }, RegexOptions.IgnoreCase)
            .NotEmpty();

        RuleFor(x => x.DateOfBirth)
            .Must(dob => DateOnly.TryParseExact(
                dob,
                "O",
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out _))
            .When(x => !string.IsNullOrEmpty(x.DateOfBirth));

        //make a custom rule for enums
        RuleFor(x => x.Gender)
            .IsEnumName(typeof(Gender))
            .NotEmpty();
    }
}