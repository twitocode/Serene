using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serene.Configuration;
using Serene.Entities;
using Serene.Features.Auth;
using Shouldly;
using Xunit;

namespace Serene.Tests.Features.Auth;

public class TokenServiceTests
{
    private readonly TokenService _sut;
    private readonly JwtOptions _options;

    public TokenServiceTests()
    {
        _options = new JwtOptions
        {
            Key = "SuperSecretKeyForTestingPurposesOnly123!",
            Authority = "SereneTest",
            Audience = "SereneTestAudience",
        };
        var optionsWrapper = Options.Create(_options);
        _sut = new TokenService(optionsWrapper);
    }

    [Fact]
    public void GenerateToken_ReturnsValidJwt()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = "test@example.com",
            Name = "Test User",
        };
        var roles = new List<string> { "User", "Admin" };

        // Act
        var token = _sut.GenerateToken(user, roles);

        // Assert
        token.ShouldNotBeNullOrEmpty();
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        jwtToken.Issuer.ShouldBe(_options.Authority);
        jwtToken.Audiences.ShouldContain(_options.Audience);

        jwtToken.Claims.Any(c => c.Value == user.Id).ShouldBeTrue();
        jwtToken.Claims.Any(c => c.Value == user.Email).ShouldBeTrue();
        jwtToken.Claims.Any(c => c.Value == user.Name).ShouldBeTrue();
        jwtToken.Claims.Count(c => c.Value == "User").ShouldBeGreaterThan(0);
        jwtToken.Claims.Count(c => c.Value == "Admin").ShouldBeGreaterThan(0);
    }

    [Fact]
    public void ValidateToken_WithValidToken_ReturnsPrincipal()
    {
        // Arrange
        var user = new User { Id = Guid.NewGuid().ToString(), Email = "test@example.com" };
        var token = _sut.GenerateToken(user, new List<string>());

        // Act
        var principal = _sut.ValidateToken(token);

        // Assert
        principal.ShouldNotBeNull();
        principal.FindFirstValue(ClaimTypes.NameIdentifier).ShouldBe(user.Id);
        principal.FindFirstValue(ClaimTypes.Email).ShouldBe(user.Email);
    }

    [Fact]
    public void ValidateToken_WithInvalidToken_ReturnsNull()
    {
        // Act
        var principal = _sut.ValidateToken("invalid.token.here");

        // Assert
        principal.ShouldBeNull();
    }
}
