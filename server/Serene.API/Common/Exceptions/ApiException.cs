namespace Serene.API.Common.Exceptions;

public class ApiException : Exception
{
    public ApiException(int statusCode)
    {
        StatusCode = statusCode;
    }

    public ApiException(int statusCode, string title, string message) : base(message)
    {
        StatusCode = statusCode;
        Title = title;
    }

    public ApiException(int statusCode, string title, string message, Exception innerException) : base(message,
        innerException)
    {
        StatusCode = statusCode;
        Title = title;
    }

    public int StatusCode { get; init; }
    public string Title { get; init; }
}