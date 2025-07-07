namespace Serene.API.Common.Services;

public interface IEmailService
{
    public Task<bool> SendConfirmationEmail(string userEmail, int code);
}
