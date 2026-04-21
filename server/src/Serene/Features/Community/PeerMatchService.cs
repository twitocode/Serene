using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Data;
using Serene.Entities;

namespace Serene.Features.Community;

public interface IPeerMatchService
{
    Task<List<string>> GetInterestsAsync(string userId);
    Task UpdateInterestsAsync(string userId, List<string> interests);
    Task<PeerMatchResponse?> GetCurrentMatchAsync(string userId);
}

public class PeerMatchService : IPeerMatchService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PeerMatchService> _logger;

    private static readonly string[] AnimalNames =
    [
        "Owl",
        "Fox",
        "Bear",
        "Deer",
        "Hawk",
        "Wolf",
        "Hare",
        "Lynx",
        "Otter",
        "Crane",
        "Finch",
        "Swan",
        "Seal",
        "Wren",
        "Dove",
    ];

    private static readonly string[] Adjectives =
    [
        "Sage",
        "Calm",
        "Kind",
        "Warm",
        "Bold",
        "Soft",
        "Wise",
        "Brave",
        "Gentle",
        "Quiet",
        "Steady",
        "Bright",
        "Mellow",
        "Serene",
        "Tender",
    ];

    public PeerMatchService(ApplicationDbContext context, ILogger<PeerMatchService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<string>> GetInterestsAsync(string userId)
    {
        return await _context
            .UserInterests.Where(x => x.UserId == userId)
            .Select(x => x.Interest)
            .ToListAsync();
    }

    public async Task UpdateInterestsAsync(string userId, List<string> interests)
    {
        var existing = await _context.UserInterests.Where(x => x.UserId == userId).ToListAsync();
        _context.UserInterests.RemoveRange(existing);

        foreach (var interest in interests.Distinct().Take(8))
        {
            _context.UserInterests.Add(
                new UserInterest { UserId = userId, Interest = interest.Trim() }
            );
        }

        await _context.SaveChangesAsync();
    }

    public async Task<PeerMatchResponse?> GetCurrentMatchAsync(string userId)
    {
        LocalDate today = SystemClock.Instance.GetCurrentInstant().InUtc().Date;
        LocalDate weekStart = today.PlusDays(-(int)today.DayOfWeek);

        var existingMatch = await _context
            .PeerMatches.Where(m =>
                (m.UserId == userId || m.MatchedUserId == userId)
                && m.IsActive
                && m.MatchDate >= weekStart
            )
            .FirstOrDefaultAsync();

        if (existingMatch != null)
        {
            var partnerId =
                existingMatch.UserId == userId ? existingMatch.MatchedUserId : existingMatch.UserId;
            return new PeerMatchResponse
            {
                MatchId = existingMatch.Id,
                AnonymousName = GenerateAnonymousName(partnerId),
                SharedInterest = existingMatch.SharedInterest,
                MatchDate = existingMatch.MatchDate.ToString(),
            };
        }

        var myInterests = await _context
            .UserInterests.Where(x => x.UserId == userId)
            .Select(x => x.Interest)
            .ToListAsync();

        if (myInterests.Count == 0)
            return null;

        var recentMatchedUserIds = await _context
            .PeerMatches.Where(m =>
                (m.UserId == userId || m.MatchedUserId == userId)
                && m.MatchDate >= weekStart.PlusDays(-7)
            )
            .Select(m => m.UserId == userId ? m.MatchedUserId : m.UserId)
            .ToListAsync();

        var candidates = await _context
            .UserInterests.Where(ui =>
                ui.UserId != userId
                && !recentMatchedUserIds.Contains(ui.UserId)
                && myInterests.Contains(ui.Interest)
            )
            .GroupBy(ui => ui.UserId)
            .Select(g => new
            {
                UserId = g.Key,
                SharedInterest = g.Select(x => x.Interest).FirstOrDefault(),
                OverlapCount = g.Count(),
            })
            .OrderByDescending(x => x.OverlapCount)
            .FirstOrDefaultAsync();

        if (candidates == null)
            return null;

        var sharedInterest = candidates.SharedInterest ?? "Shared Interest";

        var newMatch = new PeerMatch
        {
            UserId = userId,
            MatchedUserId = candidates.UserId,
            SharedInterest = sharedInterest,
            MatchDate = today,
        };

        _context.PeerMatches.Add(newMatch);
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Created peer match between {UserId} and {MatchedUserId} on interest {Interest}",
            userId,
            candidates.UserId,
            sharedInterest
        );

        return new PeerMatchResponse
        {
            MatchId = newMatch.Id,
            AnonymousName = GenerateAnonymousName(candidates.UserId),
            SharedInterest = sharedInterest,
            MatchDate = today.ToString(),
        };
    }

    private static string GenerateAnonymousName(string seed)
    {
        var hash = Math.Abs(seed.GetHashCode());
        var adj = Adjectives[hash % Adjectives.Length];
        var animal = AnimalNames[(hash / Adjectives.Length) % AnimalNames.Length];
        return $"{adj} {animal}";
    }
}
