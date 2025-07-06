using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using NodaTime;

namespace Serene.API.Data.Entities;

public enum Gender
{
    Male,
    Female,
    NonBinary,
    Transgender,
    None
}

public class User : IdentityUser<Guid>, IEntity
{
    public string FirstName { get; set; }
    public string LastName { get; set; }

    [NotMapped] public string FullName => $"{FirstName} {LastName}";

    public string CountryCode { get; set; }
    public string AvatarUrl { get; set; } = DefaultData.DefaultAvatarUrl;
    public string Pronouns { get; set; }
    public Gender Gender { get; set; } = Gender.None;

    //public Instant DateOfBirth { get; set; }
    public Instant LastMoodCheckin { get; set; }

    public string? RefreshToken { get; set; }
    public Instant? RefreshTokenExpirationDate { get; set; }

    public Preference UserPreferences { get; set; }
    public List<MoodEntry> Moods { get; set; }
    public List<Journal> Journals { get; set; }
    public List<Resource> SavedResources { get; set; }
    public Instant CreatedAt { get; set; }
}