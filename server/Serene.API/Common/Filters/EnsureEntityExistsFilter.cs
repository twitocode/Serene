using Microsoft.EntityFrameworkCore;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;

namespace Serene.API.Common.Filters;

public class EnsureEntityExistsFilter<TRequest, TEntity>(AppDbContext database, Func<TRequest, Guid?> idSelector)
    : IEndpointFilter
    where TEntity : class, IEntity
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        //TODO: maybe get id from jwt?
        var request = context.Arguments.OfType<TRequest>().Single();
        var cancellationToken = context.HttpContext.RequestAborted;
        var id = idSelector(request);

        if (id is null) return await next(context);

        var exists = await database
            .Set<TEntity>()
            .AnyAsync(x => x.Id == id, cancellationToken);

        return exists
            ? await next(context)
            : new NotFoundProblem($"{typeof(TEntity).Name} with id {id} was not found.");
    }
}