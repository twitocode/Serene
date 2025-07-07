using Microsoft.AspNetCore.Mvc;

namespace Serene.API.Common.Results;

public class Result<T>
{
    private Result(bool isSuccess, T value, int statusCode, params List<Error> errors)
    {
        IsSuccess = isSuccess;
        Value = value;
        Errors = errors.Count > 0 ? errors : [];
        StatusCode = statusCode;
    }

    public bool IsSuccess { get; }
    public T Value { get; }
    public List<Error> Errors { get; }
    public int StatusCode { get; }

    public IResult MapTypedResult(HttpContext context)
    {
        if (IsSuccess) return TypedResults.Ok(this);

        return TypedResults.Problem(new ProblemDetails
        {
            Status = StatusCode,
            Detail = Errors.Count > 1 ? "Multiple errors occurred" : "An error occurred",
            Title = "Something went wrong with the request",
            Instance = $"{context.Request.Method} => {context.Request.Path}",
            Extensions = new Dictionary<string, object?>
            {
                { "errors", Errors },
                { "isSuccess", false }
            }
        });
    }

    public static Result<T> Success(T value) => new(true, value, StatusCodes.Status200OK);

    public static Result<T> Failure(int statusCode, params List<Error> errors) =>
        new(false, default!, statusCode, errors);

    public static Result<T> NotFound(params List<Error> errors) =>
        new(false, default!, StatusCodes.Status404NotFound, errors);

    public static Result<T> BadRequest(params List<Error> errors) =>
        new(false, default!, StatusCodes.Status400BadRequest, errors);

    public static Result<T> Unauthorized(params List<Error> errors) =>
        new(false, default!, StatusCodes.Status401Unauthorized, errors);

    public static Result<T> Forbidden(params List<Error> errors) =>
        new(false, default!, StatusCodes.Status403Forbidden, errors);

    public static Result<T> InternalServerError(params List<Error> errors) =>
        new(false, default!, StatusCodes.Status500InternalServerError, errors);
}