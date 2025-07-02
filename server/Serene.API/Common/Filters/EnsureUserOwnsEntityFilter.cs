using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;

namespace Serene.API.Common.Filters;

public class EnsureUserOwnsEntityFilter<TRequest, TEntity>(AppDbContext database, Func<TRequest, Guid> idSelector)
    : IEndpointFilter
    where TEntity : class, IEntity, IOwnedEntity
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var request = context.Arguments.OfType<TRequest>().Single();
        var cancellationToken = context.HttpContext.RequestAborted;
        var userId = context.HttpContext.User.GetUserId();
        var id = idSelector(request);

        var entity = await database
            .Set<TEntity>()
            .Where(x => x.Id == id)
            .Select(x => new Entity(x.Id, x.UserId))
            .SingleOrDefaultAsync(cancellationToken);

        return entity switch
        {
            null => new NotFoundProblem($"{typeof(TEntity).Name} with id {id} was not found."),
            _ when entity.UserId != userId => TypedResults.Forbid(),
            _ => await next(context)
        };
    }

    private record Entity(Guid Id, Guid UserId);
}