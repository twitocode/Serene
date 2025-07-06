using FluentValidation;

namespace Serene.API.Common.Filters;

public class RequestValidationFilter<TRequest>(
    ILogger<RequestValidationFilter<TRequest>> logger,
    IValidator<TRequest> validator) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var request = context.Arguments.OfType<TRequest>().First();
        var validationResult = await validator.ValidateAsync(request, context.HttpContext.RequestAborted);

        if (!validationResult.IsValid)
        {
            logger.LogWarning("{Request}: Validation failed with {Validator}",
                $"{context.HttpContext.Request.Method} => {context.HttpContext.Request.Path}", typeof(TRequest).Name);

            return TypedResults.ValidationProblem(
                validationResult.ToDictionary(), 
                validationResult.ToString(),
                title: $"{typeof(TRequest).Name} Validation failed",
                instance: $"{context.HttpContext.Request.Method} => {context.HttpContext.Request.Path}");
        }

        logger.LogInformation("{Request}: Validation succeed with {Validator}",
            $"{context.HttpContext.Request.Method} => {context.HttpContext.Request.Path}", typeof(TRequest).Name);
        
        return await next(context);
    }
}