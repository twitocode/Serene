namespace Serene.Common;

public class AppException : Exception
{
    public string ErrorCode { get; }

    public AppException(string message, string errorCode = ErrorCodes.InvalidInput)
        : base(message)
    {
        ErrorCode = errorCode;
    }
}
