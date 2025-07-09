using Serene.API.Data.Entities;

namespace Serene.API.Data;

public static class EnumExtensions
{
    public static Gender ToGender(this string str)  =>
        Enum.Parse<Gender>(str);
    
    public static ActivityType ToActivityType(this string str)  =>
        Enum.Parse<ActivityType>(str);

    public static MoodType ToMoodType(this string str)  =>
        Enum.Parse<MoodType>(str);

    public static ResourceType ToResourceType(this string str)  =>
        Enum.Parse<ResourceType>(str);    
    
    public static EnergyLevelType ToEnergyLevel(this string str)  =>
        Enum.Parse<EnergyLevelType>(str);
}
