using Microsoft.Extensions.Logging;
using NodaTime;
using NSubstitute;
using Quartz;
using Serene.Jobs;
using Serene.Services;
using Xunit;

namespace Serene.Tests.Jobs;

public class QuestionGenerationJobTests
{
    private readonly IQuestionPreparationService _preparationService;
    private readonly ILogger<QuestionGenerationJob> _logger;
    private readonly QuestionGenerationJob _sut;

    public QuestionGenerationJobTests()
    {
        _preparationService = Substitute.For<IQuestionPreparationService>();
        _logger = Substitute.For<ILogger<QuestionGenerationJob>>();
        _sut = new QuestionGenerationJob(_preparationService, _logger);
    }

    [Fact]
    public async Task Execute_CallsPreparationServiceWithCorrectRange()
    {
        // Arrange
        var context = Substitute.For<IJobExecutionContext>();

        // Act
        await _sut.Execute(context);

        // Assert
        await _preparationService
            .Received(1)
            .PrepareQuestionsForRangeAsync(Arg.Any<LocalDate>(), Arg.Any<LocalDate>());
    }
}
