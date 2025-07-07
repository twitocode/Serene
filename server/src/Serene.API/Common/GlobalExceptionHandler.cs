using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Serene.API.Common.Exceptions;

namespace Serene.API.Common;

public class GlobalExceptionHandler(
    ILogger<GlobalExceptionHandler> logger,
    IProblemDetailsService problemDetailsService) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken)
    {
        httpContext.Response.StatusCode = MapStatusCode(exception);
        logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

        return await problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Title = "An error occurred while processing your request.",
                Detail = exception.Message,
                Instance = $"{httpContext.Request.Method} => {httpContext.Request.Path}",
                Extensions = new Dictionary<string, object?>()
            }
        });
    }

    private int MapStatusCode(Exception exception)
    {
        return exception switch
        {
            ApiException ex => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };
    }
}