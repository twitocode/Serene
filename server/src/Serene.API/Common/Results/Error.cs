namespace Serene.API.Common.Results;

public record Error
{
    public Error(string code, string message)
    {
        Message = message;
        Code = code;
    }

    public string Code { get; }
    public string Message { get; }
}