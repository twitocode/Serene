using FluentValidation;
using Microsoft.AspNetCore.Http.HttpResults;
using Serene.API.Common;
using Serene.API.Common.Extensions;

namespace Serene.API.Auth.Endpoints;

public class Register : IEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapPost("/register", Handle).WithSummary("Registers a user").WithRequestValidation<RequestValidator>();
    }

    private static async Task<Ok<Response>> Handle(Request request)
    {
        return TypedResults.Ok(new Response());
    }

    public record Request(string Email, string Password, string CountryCode, string AvatarUrl);

    public record Response;

    public class RequestValidator : AbstractValidator<Request>
    {
        public RequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty().MinimumLength(6).MaximumLength(30);

            RuleFor(x => x.CountryCode)
                .NotEmpty()
                .Length(2);

            RuleFor(x => x.AvatarUrl)
                .NotEmpty();
        }
    }
}