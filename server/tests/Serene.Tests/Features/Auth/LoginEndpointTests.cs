using Bogus;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging.Abstractions;
using NSubstitute;
using Serene.API.Common.Results;
using Serene.API.Data.Entities;
using Serene.API.Features.Auth.Endpoints.Login;
using Shouldly;

namespace Serene.Tests.Features.Auth;

public class LoginEndpointTests : IClassFixture<BaseEndpointTestFixture>
{
    private readonly LoginEndpoint _endpoint;
    private readonly BaseEndpointTestFixture _fixture;
    private readonly Faker<LoginRequest> _loginRequestFaker;
    private readonly Faker<User> _userFaker;

    public LoginEndpointTests(BaseEndpointTestFixture fixture)
    {
        _fixture = fixture;
        _endpoint = new LoginEndpoint(new NullLogger<LoginEndpoint>());

        // Setup Faker for test data
        _userFaker = new Faker<User>()
            .RuleFor(u => u.Id, f => f.Random.Guid())
            .RuleFor(u => u.UserName, f => f.Internet.UserName())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.EmailConfirmed, f => f.Random.Bool())
            .RuleFor(u => u.IsSetupCompleted, f => f.Random.Bool());

        _loginRequestFaker = new Faker<LoginRequest>()
            .RuleFor(l => l.Email, f => f.Internet.Email())
            .RuleFor(l => l.Password, f => f.Internet.Password());
    }

    [Fact]
    public async Task Handle_Should_ReturnSuccess_WhenCredentialsAreValid()
    {
        //_fixture.ResponseCookies.ClearReceivedCalls(); // Clear calls from previous tests

        // Arrange
        var loginRequest = _loginRequestFaker.Generate();
        var user = _userFaker.Generate();
        user.Email = loginRequest.Email;
        user.EmailConfirmed = true;
        user.IsSetupCompleted = true;

        var accessToken = "mock-access-token";
        var refreshToken = "mock-refresh-token";

        _fixture.UserManager.FindByEmailAsync(loginRequest.Email)!
            .Returns(Task.FromResult(user));

        _fixture.UserManager.CheckPasswordAsync(user, loginRequest.Password)
            .Returns(Task.FromResult(true));

        _fixture.UserManager.UpdateAsync(user)!
            .Returns(Task.FromResult(IdentityResult.Success));
        _fixture.JwtService.GenerateToken(Arg.Any<User>())
            .Returns(Tuple.Create(accessToken, DateTime.UtcNow.AddDays(7)).ToValueTuple());

        _fixture.JwtService.GenerateRefreshToken()
            .Returns(refreshToken);

        // Act
        var result =
            await _endpoint.Handle(loginRequest, _fixture.UserManager, _fixture.JwtService, CancellationToken.None);

        // Assert
        result.IsSuccess.ShouldBeTrue();

        await _fixture.UserManager.Received(1).FindByEmailAsync(loginRequest.Email);
        //await signInManager.Received(1).CheckPasswordSignInAsync(user, loginRequest.Password, false);
        _fixture.JwtService.Received(1).GenerateToken(user);
        _fixture.JwtService.Received(1).GenerateRefreshToken();
        _fixture.ResponseCookies.Received(1).Append("REFRESH_TOKEN", refreshToken, Arg.Any<CookieOptions>());
    }

    [Fact]
    public async Task Handle_Should_ReturnBadRequest_WhenUserNotFound()
    {
        //_fixture.ResponseCookies.ClearReceivedCalls(); // Clear calls from previous tests

        // Arrange
        var loginRequest = _loginRequestFaker.Generate();

        _fixture.UserManager.FindByEmailAsync(loginRequest.Email)!
            .Returns(Task.FromResult<User>(null!));

        // Act
        var result =
            await _endpoint.Handle(loginRequest, _fixture.UserManager, _fixture.JwtService, CancellationToken.None);
        // Assert
        result.IsSuccess.ShouldBeFalse();
        result.Errors.ShouldNotBeNull();
        result.Errors.ShouldContain(new Error("", $"User not found with email {loginRequest.Email}"));

        await _fixture.UserManager.Received(1).FindByEmailAsync(loginRequest.Email);
        //await signInManager.DidNotReceive().CheckPasswordSignInAsync(Arg.Any<User>(), Arg.Any<string>(), Arg.Any<bool>());
    }

    [Fact]
    public async Task Handle_Should_ReturnBadRequest_WhenPasswordIsIncorrect()
    {
//        _fixture.ResponseCookies.ClearReceivedCalls(); // Clear calls from previous tests

        // Arrange
        var loginRequest = _loginRequestFaker.Generate();
        var user = _userFaker.Generate();
        user.Email = loginRequest.Email;
        user.EmailConfirmed = true;

        _fixture.UserManager.FindByEmailAsync(loginRequest.Email)!
            .Returns(Task.FromResult(user));

        _fixture.UserManager.CheckPasswordAsync(user, loginRequest.Password)
            .Returns(Task.FromResult(false));

        _fixture.UserManager.UpdateAsync(user)!
            .Returns(Task.FromResult(IdentityResult.Success));

        // Act
        var result =
            await _endpoint.Handle(loginRequest, _fixture.UserManager, _fixture.JwtService, CancellationToken.None);
        // Assert
        result.IsSuccess.ShouldBeFalse();
        result.Errors.ShouldNotBeNull();
        result.Errors.ShouldBe([new Error("", "Password was invalid or registered with an external provider")]
        );

        await _fixture.UserManager.Received(1).FindByEmailAsync(loginRequest.Email);
        //await signInManager.Received(1).CheckPasswordSignInAsync(user, loginRequest.Password, false);
    }

    [Fact]
    public async Task Handle_Should_SetRefreshTokenCookie_WhenLoginSuccessful()
    {
       // _fixture.ResponseCookies.ClearReceivedCalls(); // Clear calls from previous tests

        // Arrange
        var loginRequest = _loginRequestFaker.Generate();
        var user = _userFaker.Generate();
        user.Email = loginRequest.Email;
        user.EmailConfirmed = true;
        user.IsSetupCompleted = true;

        var refreshToken = "mock-refresh-token";

        _fixture.UserManager.FindByEmailAsync(loginRequest.Email)!
            .Returns(Task.FromResult(user));

        _fixture.UserManager.CheckPasswordAsync(user, loginRequest.Password)
            .Returns(Task.FromResult(true));

        _fixture.UserManager.UpdateAsync(user)!
            .Returns(Task.FromResult(IdentityResult.Success));

        _fixture.JwtService.GenerateRefreshToken()
            .Returns(refreshToken);

        // Act
        var result =
            await _endpoint.Handle(loginRequest, _fixture.UserManager, _fixture.JwtService, CancellationToken.None);

        // Assert
        result.IsSuccess.ShouldBeTrue();
        _fixture.ResponseCookies.Received(1).Append("REFRESH_TOKEN", refreshToken, Arg.Is<CookieOptions>(options =>
            options.HttpOnly &&
            options.Secure &&
            options.SameSite == SameSiteMode.Lax && // <-- Corrected to Lax
            options.Expires.HasValue
        ));
    }
}