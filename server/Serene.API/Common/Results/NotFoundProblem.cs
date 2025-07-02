using System.Reflection;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Mvc;

namespace Serene.API.Common.Results;

public sealed class NotFoundProblem : IResult, IEndpointMetadataProvider, IStatusCodeHttpResult, IContentTypeHttpResult,
    IValueHttpResult, IValueHttpResult<ProblemDetails>
{
    private readonly ProblemHttpResult problem;

    public NotFoundProblem(string errorMessage)
    {
        problem = TypedResults.Problem
        (
            statusCode: StatusCode,
            title: "Not Found",
            detail: errorMessage
        );
    }

    public string? ContentType => problem.ContentType;

    public static void PopulateMetadata(MethodInfo method, EndpointBuilder builder)
    {
        builder.Metadata.Add(new ProducesResponseTypeMetadata(StatusCodes.Status404NotFound, typeof(ProblemDetails),
            ["application/problem+json"]));
    }

    public async Task ExecuteAsync(HttpContext httpContext)
    {
        await problem.ExecuteAsync(httpContext);
    }

    public int? StatusCode => StatusCodes.Status404NotFound;
    public object? Value => problem.ProblemDetails;
    ProblemDetails? IValueHttpResult<ProblemDetails>.Value => problem.ProblemDetails;
}