using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
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