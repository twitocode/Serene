using NodaTime;

namespace Serene.API.Data.Entities;

public enum MoodType
{
    Anxious,
    Sad,
    Neutral,
    Happy,
    Fantastic,
}

public enum EnergyLevelType
{
    Exhausted, Low, Moderate, High, Refreshed
}

public class MoodEntry : IEntity, IOwnedEntity
{
    public MoodType OverallMood { get; set; }
    public EnergyLevelType EnergyLevel { get; set; }
    
    //Only asked in journal entries
    public string? BestPartOfDay { get; set; } 
    public string? WorstPartOfDay { get; set; } 
    public bool HadPhysicalOrEmotionalDiscomfort { get; set; }
    
    //Db stuff ----------------------------
    public User User { get; set; }
    public Guid Id { get; set; }
    public Instant CreatedAt { get; set; }
    public Guid UserId { get; set; }
}