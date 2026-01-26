namespace Serene.Features.Users;

public class UpdateUserProfileRequest
{
    public string? Name { get; set; }
}

public class ChangePasswordRequest
{
    public required string CurrentPassword { get; set; }
    public required string NewPassword { get; set; }
}
