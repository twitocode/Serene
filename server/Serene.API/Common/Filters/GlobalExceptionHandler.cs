using System.Net;
using Microsoft.AspNetCore.Diagnostics;

namespace Serene.API.Common.Filters;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> _logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, message) = GetExceptionDetails(exception);
        _logger.LogError(exception, exception.Message);

        httpContext.Response.StatusCode = (int)statusCode;
        await httpContext.Response.WriteAsync(message, cancellationToken);

        return true;
    }

    private (HttpStatusCode code, string message) GetExceptionDetails(Exception exception)
    {
        return exception switch
        {
            //add more as you go
            _ => (HttpStatusCode.InternalServerError, "Something happened with the server")
        };
    }
}