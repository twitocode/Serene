using Microsoft.AspNetCore.Mvc;
using Serene.Common;

namespace Serene.Features.Shared;

public abstract class BaseApiController : ControllerBase
{
    protected readonly ILogger _logger;

    protected BaseApiController(ILogger logger)
    {
        _logger = logger;
    }

    protected string? GetUserId() => User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

    protected async Task<IActionResult> ExecuteWithResult(Func<Task> action)
    {
        try
        {
            await action();
            return new OkObjectResult(Result<object>.Success(new { Success = true }));
        }
        catch (AppException ex)
        {
            _logger.LogWarning("Business rule violation: {Message} ({ErrorCode})", ex.Message, ex.ErrorCode);
            return new BadRequestObjectResult(Result.Failure(ex.Message, ex.ErrorCode));
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid input: {Message}", ex.Message);
            return new BadRequestObjectResult(Result.Failure(ex.Message, ErrorCodes.InvalidInput));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthorized access attempt: {Message}", ex.Message);
            return new UnauthorizedObjectResult(Result.Failure(ex.Message, ErrorCodes.Unauthorized));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred during an API call");
            return new ObjectResult(Result.Failure(ex.Message, ErrorCodes.ServerError)) { StatusCode = 500 };
        }
    }

    protected async Task<IActionResult> ExecuteWithResult<T>(Func<Task<T>> action)
    {
        try
        {
            var value = await action();
            var result = Result<T>.Success(value);
            return new OkObjectResult(result);
        }
        catch (AppException ex)
        {
            _logger.LogWarning("Business rule violation: {Message} ({ErrorCode})", ex.Message, ex.ErrorCode);
            return new BadRequestObjectResult(Result<T>.Failure(ex.Message, ex.ErrorCode));
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Invalid input: {Message}", ex.Message);
            return new BadRequestObjectResult(Result<T>.Failure(ex.Message, ErrorCodes.InvalidInput));
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning("Resource not found: {Message}", ex.Message);
            return new NotFoundObjectResult(Result<T>.Failure(ex.Message, ErrorCodes.NotFound));
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning("Unauthorized access attempt: {Message}", ex.Message);
            return new UnauthorizedObjectResult(Result<T>.Failure(ex.Message, ErrorCodes.Unauthorized));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unexpected error occurred during an API call");
            return new ObjectResult(Result<T>.Failure(ex.Message, ErrorCodes.ServerError)) { StatusCode = 500 };
        }
    }
}