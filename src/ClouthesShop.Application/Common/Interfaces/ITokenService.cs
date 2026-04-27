using ClouthesShop.Domain.Entities;

namespace ClouthesShop.Application.Common.Interfaces;

public record TokenResult(string AccessToken, string RefreshToken, DateTime ExpiresAt);

public interface ITokenService
{
    TokenResult GenerateTokens(User user);
    string GenerateRefreshToken();
    Guid? ValidateAccessToken(string token);
}
