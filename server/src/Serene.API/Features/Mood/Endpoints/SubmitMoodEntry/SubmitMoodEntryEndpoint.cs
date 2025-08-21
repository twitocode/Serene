using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.API.Common;
using Serene.API.Common.Extensions;
using Serene.API.Common.Mappers;
using Serene.API.Common.Results;
using Serene.API.Data;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Mood.Endpoints.SubmitMoodEntry;

public class SubmitMoodEntryEndpoint : IEndpoint
{
    public RouteHandlerBuilder MapEndpoint(IEndpointRouteBuilder app) =>
        app.MapPost("/mood",
                async ([FromBody] SubmitMoodEntryRequest request, HttpContext ctx, AppDbContext db,
                    CancellationToken ct) =>
                {
                    var result = await Handle(request, ctx, db, ct);
                    return result.MapTypedResult(ctx);
                })
            .RequireAuthorization()
            .WithEnsureUserExists()
            .WithRequestValidation<SubmitMoodEntryRequest>()
            .WithTags(Tags.Mood)
            .WithSummary("Submit a new mood entry");

    public async Task<Result<SubmitMoodEntryResponse>> Handle(SubmitMoodEntryRequest request, HttpContext ctx, AppDbContext db,
        CancellationToken ct)
    {
        var user = ctx.GetUser();

        var now = SystemClock.Instance.GetCurrentInstant();
        var zonedDateTimeUtc = now.InUtc();
        var todaysLocalDate = now.InUtc().Date;

        if (user.LastMoodCheckin.Day >= todaysLocalDate.Day)
            return Result<SubmitMoodEntryResponse>.BadRequest(new Error(AppErrors.MoodEntryNotReady, "You are not able to create a new mood entry yet"));

        var doesTodaysEntryExist = await db.MoodEntries
            .AnyAsync(x => x.CreatedAt.InUtc().Date == todaysLocalDate && x.UserId == user.Id, ct);

        if (doesTodaysEntryExist)
            return Result<SubmitMoodEntryResponse>.BadRequest(new Error(AppErrors.MoodEntryCompletedAlready, "Mood entry already completed for today"));

        var newEntry = new MoodEntry
        {
            BestPartOfDay = request.BestPartOfDay ?? string.Empty,
            WorstPartOfDay = request.WorstPartOfDay ?? string.Empty,
            OverallMood = request.OverallMood.ToMoodType(),
            EnergyLevel = request.EnergyLevel.ToEnergyLevel(),
            HadPhysicalOrEmotionalDiscomfort = request.HadPhysicalOrEmotionalDiscomfort,
            UserId = user.Id
        };

        db.MoodEntries.Add(newEntry);
        user.LastMoodCheckin = todaysLocalDate;

        await db.SaveChangesAsync(ct);

        var response = newEntry.ToSubmitMoodEntry();
        return Result<SubmitMoodEntryResponse>.Success(response);
    }
}