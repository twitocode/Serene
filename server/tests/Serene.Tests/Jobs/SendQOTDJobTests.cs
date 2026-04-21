using Microsoft.Extensions.Logging;
using NSubstitute;
using Quartz;
using Serene.Features.Community;
using Serene.Jobs;
using Xunit;

namespace Serene.Tests.Jobs;

public class SendQOTDJobTests
{
    private readonly ILogger<SendQOTDJob> _logger;
    private readonly ICommunityService _communityService;
    private readonly SendQOTDJob _sut;

    public SendQOTDJobTests()
    {
        _logger = Substitute.For<ILogger<SendQOTDJob>>();
        _communityService = Substitute.For<ICommunityService>();
        _sut = new SendQOTDJob(_logger, _communityService);
    }

    [Fact]
    public async Task Execute_CallsCreateNewQOTD()
    {
        // Arrange
        var context = Substitute.For<IJobExecutionContext>();

        // Act
        await _sut.Execute(context);

        // Assert
        await _communityService.Received(1).CreateNewQOTD();
    }
}
