using Serene.API.Data.Entities;

namespace Serene.API.Features.Auth.Services;

public interface IJwtService
{
    public (string token, DateTime expirationDate) GenerateToken(User user);
    public string GenerateRefreshToken();
    public void WriteAuthTokenAsHttpOnlyCookie(string cookieName, string token, DateTime expirationTime);
}