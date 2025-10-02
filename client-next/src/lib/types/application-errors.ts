export enum AppErrors
{
    UserNotFound = "UserNotFound",
    UserUpdateError = "UserUpdateError",
    UserAlreadyExists = "UserAlreadyExists",
    MoodEntryNotReady = "MoodEntryNotReady",
    MoodEntryCompletedAlready = "MoodEntryCompletedAlready",
    AuthInvalidPassword = "AuthInvalidPassword",
    RefreshTokenError = "RefreshTokenError",
    ClaimsIdentityNotFound = "ClaimsIdentityNotFound",
    ClaimsEmailNotFound = "ClaimsEmailNotFound",
    AuthGoogleLoginError = "AuthGoogleLoginError",
    AuthGoogleCallbackError = "AuthGoogleCallbackError",
    InvalidReturnUrl = "InvalidReturnUrl",
}
