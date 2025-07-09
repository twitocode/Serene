using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;

namespace Serene.API.Common.Filters;

public class EnsureEntityUserFilter(UserManager<User> manager, Guid id) : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var cancellationToken = context.HttpContext.RequestAborted;
        var user = await manager.Users.FirstOrDefaultAsync(user => user.Id == id, cancellationToken);

        if (user is not null)
        {
            context.HttpContext.Items["User"] = user;
            return await next(context);
        }

        return new NotFoundProblem($"{nameof(User)} with id {id} was not found.");
    }
}