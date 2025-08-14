using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

[JsonConverter(typeof(StringEnumConverter))]

public enum AppErrors
{
    UserNotFound,
    UserUpdateError,
    UserAlreadyExists,
    MoodEntryNotReady,
    MoodEntryCompletedAlready,
    AuthInvalidPassword,
    RefreshTokenError,
    ClaimsIdentityNotFound,
    ClaimsEmailNotFound,
    AuthGoogleLoginError,
    AuthGoogleCallbackError,
    InvalidReturnUrl,
}


public static class AppErrorExtensions
{
    public static AppErrors ToAppError(this string error) =>
        Enum.Parse<AppErrors>(error);
    public static string ToJSON(this AppErrors error) =>
        JsonConvert.ToString(error);
}