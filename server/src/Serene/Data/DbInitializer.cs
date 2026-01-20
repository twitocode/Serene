using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NodaTime;
using Serene.Entities;

namespace Serene.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();

        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roleNames = ["Admin", "User"];
        foreach (var roleName in roleNames)
        {
            var roleExist = await roleManager.RoleExistsAsync(roleName);
            if (!roleExist)
            {
                await roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }

        await SeedQuestionBankAsync(context);
    }

    private static async Task SeedQuestionBankAsync(ApplicationDbContext context)
    {
        if (await context.QuestionBanks.AnyAsync())
            return;

        var questions = new List<QuestionBank>
        {
            new() { Question = "What is one thing that made you smile today?", Category = "Gratitude" },
            new() { Question = "How do you usually recharge after a long day?", Category = "Self-Care" },
            new() { Question = "What is a small goal you're working toward right now?", Category = "Growth" },
            new() { Question = "What is the best piece of advice you've ever received?", Category = "Wisdom" },
            new() { Question = "If you could learn any new skill instantly, what would it be?", Category = "Fun" },
            new() { Question = "What is a book, movie, or song that has had a big impact on you?", Category = "Inspiration" },
            new() { Question = "How do you handle stress when things get overwhelming?", Category = "Coping" },
            new() { Question = "What does a perfect day look like to you?", Category = "Imagination" },
            new() { Question = "What is something you're looking forward to this week?", Category = "Positivity" },
            new() { Question = "Who is someone that inspires you, and why?", Category = "Connections" },
        };

        foreach (var q in questions)
        {
            q.CreatedAt = SystemClock.Instance.GetCurrentInstant();
            q.IsActive = true;
        }

        context.QuestionBanks.AddRange(questions);
        await context.SaveChangesAsync();
    }

    public static async Task PromoteUserToAdminAsync(IServiceProvider serviceProvider, string email)
    {
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
        var user = await userManager.FindByEmailAsync(email);
        if (user != null)
        {
            if (!await userManager.IsInRoleAsync(user, "Admin"))
            {
                await userManager.AddToRoleAsync(user, "Admin");
            }
        }
    }
}
