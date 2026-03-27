using Microsoft.EntityFrameworkCore;
using Serene.Entities;

namespace Serene.Data;

public static class AchievementSeedData
{
    public static async Task SeedAchievementsAsync(ApplicationDbContext context)
    {
        if (await context.Achievements.AnyAsync()) return;

        var achievements = new List<Achievement>
        {
            new() { Slug = "first-checkin", Title = "First Steps", Description = "Complete your first check-in", Points = 10 },
            new() { Slug = "streak-3", Title = "Building Habits", Description = "Maintain a 3-day streak", Points = 20 },
            new() { Slug = "streak-7", Title = "One Week Strong", Description = "Maintain a 7-day streak", Points = 50 },
            new() { Slug = "streak-14", Title = "Two Week Warrior", Description = "Maintain a 14-day streak", Points = 100 },
            new() { Slug = "streak-30", Title = "Monthly Champion", Description = "Maintain a 30-day streak", Points = 200 },
            new() { Slug = "checkin-10", Title = "Regular Visitor", Description = "Complete 10 check-ins", Points = 30 },
            new() { Slug = "checkin-25", Title = "Self-Aware", Description = "Complete 25 check-ins", Points = 60 },
            new() { Slug = "checkin-50", Title = "Reflection Master", Description = "Complete 50 check-ins", Points = 120 },
            new() { Slug = "checkin-100", Title = "Century Club", Description = "Complete 100 check-ins", Points = 250 },
            new() { Slug = "first-reframe", Title = "New Perspective", Description = "Reframe a thought for the first time", Points = 15 },
            new() { Slug = "reframe-10", Title = "Thought Challenger", Description = "Reframe 10 thoughts", Points = 50 },
            new() { Slug = "first-activity", Title = "Getting Moving", Description = "Complete your first activity", Points = 15 },
            new() { Slug = "activity-10", Title = "Active Mind", Description = "Complete 10 activities", Points = 50 },
            new() { Slug = "activity-25", Title = "Activation Pro", Description = "Complete 25 activities", Points = 100 },
        };

        context.Achievements.AddRange(achievements);
        await context.SaveChangesAsync();
    }
}
