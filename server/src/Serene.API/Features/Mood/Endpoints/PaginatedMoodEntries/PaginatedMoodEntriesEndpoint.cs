using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth;

namespace Serene.API.Features.Mood.Endpoints.PaginatedMoodEntries;

public class PaginatedMoodEntriesEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapPost("/mood/all",
                async ([FromQuery] int page, [FromQuery] int pageSize, HttpContext ctx, AppDbContext db,
                    CancellationToken ct) =>
                {
                    var result = await Handle(new PaginatedMoodEntriesRequest(page, pageSize), ctx, db, ct);
                    return result.MapTypedResult(ctx);
                })
            .RequireAuthorization()
            .WithEnsureUserExists()
            .WithTags(Tags.Mood)
            .WithSummary("Gets all paginated mood entries");

    private async Task<Result<List<PaginatedMoodEntriesResponse>>> Handle(PaginatedMoodEntriesRequest request, HttpContext ctx,
        AppDbContext db,
        CancellationToken ct)
    {
        var userId = ctx.User.GetUserId();
        var results = await db.MoodEntries
            .Where(x => x.UserId == userId)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.Page)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x =>
                new PaginatedMoodEntriesResponse
                {
                    BestPartOfDay = x.BestPartOfDay,
                    CreatedAt = x.CreatedAt.ToString(),
                    EnergyLevel = x.EnergyLevel.ToString(),
                    OverallMood = x.OverallMood.ToString(),
                    WorstPartOfDay = x.WorstPartOfDay,
                    HadPhysicalOrEmotionalDiscomfort = x.HadPhysicalOrEmotionalDiscomfort
                }
            )
            .ToListAsync(ct);

        return Result<List<PaginatedMoodEntriesResponse>>.Success(results);
    }
}