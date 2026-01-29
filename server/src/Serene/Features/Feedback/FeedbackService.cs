using System.Text.Json;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.Extensions.Options;
using Serene.Data;
using Serene.Features.Feedback;

public interface IFeedbackService
{
    Task SendAsync(FeedbackRequest body, string uid);
}

public class FeedbackService : IFeedbackService
{
    private readonly ILogger<FeedbackService> _logger;
    private readonly ApplicationDbContext _context;
    private readonly SheetsService _sheetsService;
    private readonly IOptions<Serene.Configuration.GoogleOptions> _options;
    private const string ApplicationName = "Serene";

    public FeedbackService(
        ApplicationDbContext context,
        ILogger<FeedbackService> logger,
        IOptions<Serene.Configuration.GoogleOptions> options
    )
    {
        _context = context;
        _logger = logger;
        _options = options;

        string email = "Unknown";
        try
        {
            using var doc = JsonDocument.Parse(options.Value.ServiceAccount);
            if (doc.RootElement.TryGetProperty("client_email", out var prop))
            {
                email = prop.GetString() ?? "Unknown";
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to parse ServiceAccount JSON for logging");
        }

        using (
            var stream = new MemoryStream(
                System.Text.Encoding.UTF8.GetBytes(options.Value.ServiceAccount)
            )
        )
        {
            var googleCredential = GoogleCredential
                .FromStream(stream)
                .CreateScoped(SheetsService.Scope.Spreadsheets);

            _logger.LogInformation(
                "Initializing FeedbackService. SheetId: {SheetId}, ServiceAccountEmail: {Email}",
                options.Value.FeedbackSheetId,
                email
            );

            _sheetsService = new SheetsService(
                new BaseClientService.Initializer
                {
                    HttpClientInitializer = googleCredential,
                    ApplicationName = ApplicationName,
                }
            );
        }
    }

    public async Task SendAsync(FeedbackRequest body, string uid)
    {
        var spreadsheet = await _sheetsService
            .Spreadsheets.Get(_options.Value.FeedbackSheetId)
            .ExecuteAsync();
        var sheetName = spreadsheet.Sheets.FirstOrDefault()?.Properties.Title ?? "Sheet1";

        _logger.LogInformation("Detected Sheet Name: {SheetName}", sheetName);

        var values = new List<IList<object>>
        {
            new List<object> { DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"), uid, body.Message },
        };

        var valueRange = new ValueRange { Values = values };
        var range = $"'{sheetName}'!A:C";

        var appendRequest = _sheetsService.Spreadsheets.Values.Append(
            valueRange,
            _options.Value.FeedbackSheetId,
            range
        );

        appendRequest.ValueInputOption = SpreadsheetsResource
            .ValuesResource
            .AppendRequest
            .ValueInputOptionEnum
            .USERENTERED;

        var appendResponse = await appendRequest.ExecuteAsync();

        _logger.LogInformation($"Updated {appendResponse.Updates.UpdatedCells} cells.");
    }
}
