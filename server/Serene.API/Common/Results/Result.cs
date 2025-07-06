namespace Serene.API.Common.Results;

public class Result<T>
{
    private Result(bool isSuccess, T value, Error? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public bool IsSuccess { get; }
    public T Value { get; }
    public Error? Error { get; }

    public static Result<T> Success(T value) => new(isSuccess: true, value, error: null);

    public static Result<T> Failure(Error error) => new(isSuccess: false, value: default, error);

    public IResult MapTypedResult()
    {
        if (Error is null) return TypedResults.Ok(this);

        return Error.StatusCode switch
        {
            StatusCodes.Status500InternalServerError => TypedResults.InternalServerError(this),
            StatusCodes.Status404NotFound => TypedResults.NotFound(this),
            StatusCodes.Status400BadRequest => TypedResults.BadRequest(this),
            StatusCodes.Status401Unauthorized => TypedResults.Unauthorized(),
            StatusCodes.Status403Forbidden => TypedResults.Forbid(),

            _ => TypedResults.InternalServerError(this)
        };
    }
}