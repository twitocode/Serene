using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Serene.API.Common;
using Serene.API.Data.Entities;

namespace Serene.API.Data;

public class AppDbContext(IConfiguration configuration, DbContextOptions options)
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public DbSet<Journal> Journals { get; set; }
    public DbSet<Preference> UserPreferences { get; set; }
    public DbSet<Resource> Resources { get; set; }
    public DbSet<MoodEntry> MoodEntries { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(configuration.GetConnectionString(MagicStrings.DatabaseConnectionStringName), o => o
            .SetPostgresVersion(15, 12)
            .UseNodaTime()
            .MapEnum<MoodType>("mood")
            .MapEnum<ResourceType>("resource_type")
            .MapEnum<Gender>("gender")
            .MapEnum<EnergyLevelType>("energy_level")
        ).UseSnakeCaseNamingConvention();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //User------------------------------------------
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.FirstName)
                .IsRequired(false);

            entity.Property(e => e.LastName)
                .IsRequired(false);

            entity.Property(e => e.IsSetupCompleted)
                .HasDefaultValue(false)
                .IsRequired();

            entity.Property(e => e.Country)
                .IsRequired(false);

            entity.Property(e => e.AvatarUrl)
                .HasDefaultValue(DefaultData.DefaultAvatarUrl)
                .IsRequired(false);

            entity.Property(e => e.Pronouns)
                .IsRequired(false);

            entity.Property(e => e.Gender)
                .HasDefaultValue(Gender.None)
                .IsRequired();

            entity.Property(e => e.DateOfBirth); //maybe add something
            entity.Property(e => e.LastMoodCheckin); //maybe add something
            entity.Property(e => e.RefreshToken); //maybe add something
            entity.Property(e => e.RefreshTokenExpirationDate); //maybe add something
        });


        //Journal---------------------------------------
        modelBuilder.Entity<Journal>(entity =>
        {
            entity.Property(e => e.Title)
                .HasMaxLength(50)
                .IsRequired();
            
            entity.Property(e => e.WhatsOnYourMind)
                .HasMaxLength(1400)
                .IsRequired(false);
            
            entity.Property(e => e.WhatAreYouGratefulForToday)
                .HasMaxLength(1400)
                .IsRequired(false);
            

            entity.Property(e => e.Activities)
                .HasConversion(
                    v => v.Select(x => x.ToString()).ToList(),
                    v => v.Select(Enum.Parse<ActivityType>).ToList()
                );
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()");
        });


        //Mood------------------------------------------
        modelBuilder.Entity<MoodEntry>(entity =>
        {
            entity.Property(e => e.OverallMood)
                .HasDefaultValue(MoodType.Neutral)
                .IsRequired();
            
            entity.Property(e => e.EnergyLevel)
                .HasDefaultValue(EnergyLevelType.Moderate)
                .IsRequired();

            entity.Property(e => e.BestPartOfDay)
                .HasMaxLength(250)
                .IsRequired(false);

            entity.Property(e => e.WorstPartOfDay)
                .HasMaxLength(250)
                .IsRequired(false);

            entity.Property(e => e.HadPhysicalOrEmotionalDiscomfort)
                .HasDefaultValue(false)
                .IsRequired();
            
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()");
        });
           

        //Resource--------------------------------------
        modelBuilder.Entity<Resource>(entity =>
        {
            entity.Property(e => e.MarkdownLink)
                .IsRequired(false);

            entity.Property(e => e.Title)
                .IsRequired();

            entity.Property(e => e.Summary)
                .IsRequired();

            entity.Property(e => e.Thumbnail)
                .IsRequired(false);

            entity.Property(e => e.Author)
                .IsRequired();

            entity.Property(e => e.ResourceType)
                .HasDefaultValue(ResourceType.Article)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()");
        });


        //Preference------------------------------------
        modelBuilder.Entity<Preference>(entity =>
        {
            entity.HasKey(p => p.UserId);

            // Configure the one-to-one relationship
            entity.HasOne(p => p.User) // Preference has one User
                .WithOne(u => u.UserPreferences) // User has one Preference
                .HasForeignKey<Preference>(p => p.UserId); // UserId is the FK on Preference

            entity.Property(p => p.Theme)
                .HasDefaultValue(Theme.Light)
                .IsRequired();

            entity.Property(p => p.PageLock)
                .IsRequired(false); // Make nullable

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()");
        });
    }
}