using System.Net;
using System.Net.Mail;

namespace Serene.API.Common.Services;

public class SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger) : IEmailService
{
    private readonly string Password =
        configuration["Email:Password"] ?? throw new ArgumentNullException("Email:Password");

    private readonly string Username =
        configuration["Email:Username"] ?? throw new ArgumentNullException("Email:Username");

    public async Task<bool> SendConfirmationEmail(string userEmail, string code, CancellationToken cancellationToken)
    {
        var mailMessage = new MailMessage();
        mailMessage.From = new MailAddress(Username, "Serene"); // Use a verified sender
        mailMessage.To.Add(new MailAddress(userEmail));
        mailMessage.Subject = "Confirm your email for Serene";
        mailMessage.IsBodyHtml = true;
        mailMessage.Body = $"""Enter in this code into Serene to confirm your email: <strong>{code}</strong>""";

        using var smtpClient = new SmtpClient("smtp.google.com", 587); // Your SMTP host and port
        smtpClient.Credentials = new NetworkCredential(Username, Password);
        smtpClient.EnableSsl = true; // Use SSL/TLS

        try
        {
            await smtpClient.SendMailAsync(mailMessage, cancellationToken);
            return true;
        }
        catch (SmtpFailedRecipientsException ex) // Catch this first if you need specific handling
        {
            logger.LogError(ex, "Email delivery failed for one or more recipients: {Message}", ex.Message);
            return false;
        }
        catch (SmtpException ex) // General SMTP errors (connection, authentication, etc.)
        {
            logger.LogError(ex, "SMTP error while sending email: {Message}", ex.Message);
            return false;
        }
        catch (Exception ex) // Catch any other unexpected errors
        {
            logger.LogError(ex, "An unexpected error occurred while sending email: {Message}", ex.Message);
            return false;
        }
    }
}