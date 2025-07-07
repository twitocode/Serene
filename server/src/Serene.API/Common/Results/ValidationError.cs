using System.Reflection;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http.Metadata;

namespace Serene.API.Common.Results;

public sealed class ValidationError : IResult, IEndpointMetadataProvider, IStatusCodeHttpResult, IContentTypeHttpResult,
    IValueHttpResult, IValueHttpResult<HttpValidationProblemDetails>
{
    private readonly ValidationProblem problem;

    public ValidationError(string errorMessage)
    {
        problem = TypedResults.ValidationProblem
        (
            new Dictionary<string, string[]>(),
            errorMessage
        );
    }

    public string? ContentType => problem.ContentType;

    public static void PopulateMetadata(MethodInfo method, EndpointBuilder builder)
    {
        builder.Metadata.Add(new ProducesResponseTypeMetadata(StatusCodes.Status400BadRequest,
            typeof(HttpValidationProblemDetails), ["application/problem+json"]));
    }

    public async Task ExecuteAsync(HttpContext httpContext)
    {
        await problem.ExecuteAsync(httpContext);
    }

    public int? StatusCode => problem.StatusCode;
    public object? Value => problem.ProblemDetails;
    HttpValidationProblemDetails? IValueHttpResult<HttpValidationProblemDetails>.Value => problem.ProblemDetails;
}