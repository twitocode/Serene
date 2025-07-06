namespace Serene.API.Common.Results;

public class Error
{
    private Error(string message, int statusCode)
    {
        Message = message;
        StatusCode = statusCode;
    }

    public string Message { get; }
    public int StatusCode { get; }

    public static Error NotFound(string message) => new(message, StatusCodes.Status404NotFound);
    public static Error BadRequest(string message) => new(message, StatusCodes.Status400BadRequest);
    public static Error Unauthorized(string message) => new(message, StatusCodes.Status401Unauthorized);
    public static Error Forbidden(string message) => new(message, StatusCodes.Status403Forbidden);
    public static Error InternalServerError(string message) => new(message, StatusCodes.Status500InternalServerError);
}