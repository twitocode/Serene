using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Serene.Entities;

namespace Serene.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    public DbSet<Profile> Profiles { get; set; }
    public DbSet<Verification> Verifications { get; set; }
    public DbSet<SafetyPlan> SafetyPlans { get; set; }
    public DbSet<Preferences> Preferences { get; set; }
    public DbSet<School> Schools { get; set; }
    public DbSet<Achievement> Achievements { get; set; }
    public DbSet<UserAchievement> UserAchievements { get; set; }
    public DbSet<Checkin> Checkins { get; set; }
    public DbSet<QuestionOfTheDay> QuestionsOfTheDay { get; set; }
    public DbSet<Post> Posts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder); 

        // Configure UserAchievement composite key
        modelBuilder.Entity<UserAchievement>()
            .HasKey(ua => new { ua.UserId, ua.AchievementId });

        // Configure Achievement unique slug
        modelBuilder.Entity<Achievement>()
            .HasIndex(a => a.Slug)
            .IsUnique();

        // Relationships
        modelBuilder.Entity<Profile>()
            .HasOne(p => p.User)
            .WithOne(u => u.Profile)
            .HasForeignKey<Profile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<SafetyPlan>()
            .HasOne(sp => sp.User)
            .WithOne(u => u.SafetyPlan)
            .HasForeignKey<SafetyPlan>(sp => sp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Preferences>()
            .HasOne(p => p.User)
            .WithOne(u => u.Preferences)
            .HasForeignKey<Preferences>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserAchievement>()
            .HasOne(ua => ua.User)
            .WithMany(u => u.UserAchievements)
            .HasForeignKey(ua => ua.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserAchievement>()
            .HasOne(ua => ua.Achievement)
            .WithMany()
            .HasForeignKey(ua => ua.AchievementId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Profile>()
            .HasOne(p => p.School)
            .WithMany()
            .HasForeignKey(p => p.SchoolId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Checkin>()
            .HasOne(c => c.User)
            .WithMany(u => u.Checkins)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
            
        modelBuilder.Entity<Post>()
            .HasOne(p => p.QuestionOfTheDay)
            .WithMany()
            .HasForeignKey(p => p.QotdId)
            .OnDelete(DeleteBehavior.Cascade);
  }
}
