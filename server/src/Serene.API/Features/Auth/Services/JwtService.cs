using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Serene.API.Data.Entities;

namespace Serene.API.Features.Auth.Services;

public class JwtOptions
{
    public required string Secret { get; init; }
    public required string[] Audiences { get; init; }
    public required string[] Issuers { get; init; }
    public required int ExpirationTimeInMinutes { get; init; }
}

public class JwtService(IOptions<JwtOptions> options, IHttpContextAccessor httpContextAccessor) : IJwtService
{
    public (string token, DateTime expirationDate) GenerateToken(User user)
    {
        var key = SecurityKey(options.Value.Secret);
        var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expirationDate = DateTime.UtcNow.AddMinutes(options.Value.ExpirationTimeInMinutes);
        var token = new JwtSecurityToken
        (
            claims:
            [
                new Claim(ClaimTypes.Email, user.Email ?? user.UserName ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Iss, options.Value.Issuers[0]),
                new Claim(JwtRegisteredClaimNames.Aud, options.Value.Audiences[0]),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64),
                new Claim("profile-completed", user.IsSetupCompleted.ToString())
            ],
            signingCredentials: signingCredentials,
            expires: expirationDate,
            issuer: options.Value.Issuers[0],
            audience: options.Value.Audiences[0]
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expirationDate);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public void WriteAuthTokenAsHttpOnlyCookie(string cookieName, string token, DateTime expirationTime)
    {
        httpContextAccessor.HttpContext?.Response.Cookies.Append(cookieName, token,
            new CookieOptions
            {
                Expires = expirationTime,
                Secure = true,
                HttpOnly = true,
                IsEssential = true,
                //SameSite = SameSiteMode.Strict //only works for server
                SameSite = SameSiteMode.Lax //better balance
            });
    }

    public static SymmetricSecurityKey SecurityKey(string key) => new(Encoding.ASCII.GetBytes(key));
}