using Resend;

namespace Serene.API.Common.Services;

public class ResendEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger, IResend resend)
    : IEmailService
{
    private readonly string Password =
        configuration["Email:Password"] ?? throw new ArgumentNullException("Email:Password");

    private readonly string Username =
        configuration["Email:Username"] ?? throw new ArgumentNullException("Email:Username");

    public async Task<bool> SendConfirmationEmail(string userEmail, string code, CancellationToken cancellationToken)
    {
        var message = new EmailMessage();
        message.From = "Serene <info.sereneapp@gmail.com>";
        message.To.Add(userEmail);
        message.Subject = "Confirm your email for Serene";
        message.HtmlBody = $"""Enter in this code into Serene to confirm your email: <strong>{code}</strong>""";
        var response = await resend.EmailSendAsync(message, cancellationToken);

        if (response.Success)
            return true;

        logger.LogError(response.Exception, "Could not send email. Error type:{reason}", response.Exception?.ErrorType);
        if (response.Exception is not null) throw response.Exception;
        return false;
    }
}