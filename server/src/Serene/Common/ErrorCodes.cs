namespace Serene.Common;

public static class ErrorCodes
{
    public const string Unauthorized = "UNAUTHORIZED";
    public const string UserNotFound = "USER_NOT_FOUND";
    public const string UserAlreadyExists = "USER_ALREADY_EXISTS";
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string UsernameTaken = "USERNAME_TAKEN";
    public const string InvalidInput = "INVALID_INPUT";
    public const string ValidationError = "VALIDATION_ERROR";

    public const string InvalidStepOrder = "INVALID_STEP_ORDER";

    public const string ServerError = "SERVER_ERROR";
    public const string DatabaseError = "DATABASE_ERROR";
    public const string NetworkError = "NETWORK_ERROR";
    public const string NotFound = "NOT_FOUND";
}
