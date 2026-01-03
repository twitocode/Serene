using System.Text.Json.Serialization;

namespace Serene.Common;

public class Result
{
    [JsonPropertyName("isSuccess")]
    public bool IsSuccess { get; set; }

    [JsonPropertyName("message")]
    public string? Message { get; set; }

    [JsonPropertyName("errorCode")]
    public string? ErrorCode { get; set; }
    
    [JsonPropertyName("errors")]
    public string[] Errors { get; set; } = [];


    [JsonIgnore]
    public bool IsFailure => !IsSuccess;

    public Result() { }

    protected Result(bool isSuccess, string? error, string? errorCode)
    {
        IsSuccess = isSuccess;
        Message = error;
        ErrorCode = errorCode;
    }

    public static Result Success() => new(true, null, null);
    public static Result Failure(string error, string? errorCode = null) => new(false, error, errorCode);
}

public class Result<T> : Result
{
    [JsonPropertyName("data")]
    public T? Data { get; set; }

    public Result() { }

    protected Result(T? data, bool isSuccess, string? error, string? errorCode)
        : base(isSuccess, error, errorCode)
    {
        Data = data;
    }

    public static Result<T> Success(T data) => new(data, true, null, null);
    public static new Result<T> Failure(string error, string? errorCode = null) => new(default, false, error, errorCode);
}
