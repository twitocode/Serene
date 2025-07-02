using Microsoft.AspNetCore.Identity;
using NodaTime;

namespace Serene.API.Data.Entities;

public class User : IdentityUser<Guid>, IEntity
{
    public required string CountryCode { get; set; }
    public string AvatarUrl { get; set; } = DefaultData.DefaultAvatarUrl;
    public string Pronouns { get; set; }

    //public Instant DateOfBirth { get; set; }
    public Instant LastMoodCheckin { get; set; }

    public Preference UserPreferences { get; set; }
    public List<MoodEntry> Moods { get; set; }
    public List<Journal> Journals { get; set; }
    public List<Resource> SavedResources { get; set; }
    public Instant CreatedAt { get; set; }
}