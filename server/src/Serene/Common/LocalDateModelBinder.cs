// Example for LocalDate
using Microsoft.AspNetCore.Mvc.ModelBinding;
using NodaTime.Text;

public class LocalDateModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var value = bindingContext.ValueProvider.GetValue(bindingContext.ModelName).FirstValue;
        if (string.IsNullOrEmpty(value))
            return Task.CompletedTask;

        var result = LocalDatePattern.Iso.Parse(value);
        if (result.Success)
        {
            bindingContext.Result = ModelBindingResult.Success(result.Value);
        }
        else
        {
            bindingContext.ModelState.TryAddModelError(
                bindingContext.ModelName,
                "Invalid date format."
            );
        }
        return Task.CompletedTask;
    }
}
