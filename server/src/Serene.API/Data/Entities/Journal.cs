using NodaTime;

namespace Serene.API.Data.Entities;

public enum ActivityType
{
}

public class Journal : IEntity, IOwnedEntity
{
    public string Title { get; set; }
    public string? WhatsOnYourMind { get; set; }
    public string? WhatAreYouGratefulForToday { get; set; }
    public List<ActivityType> Activities { get; set; } = [];
    public bool IsDraft { get; set; }

    public User User { get; set; }
    public MoodEntry MoodEntry { get; set; }

    public Guid Id { get; set; }
    public Instant CreatedAt { get; set; }
    public Guid UserId { get; set; }
}