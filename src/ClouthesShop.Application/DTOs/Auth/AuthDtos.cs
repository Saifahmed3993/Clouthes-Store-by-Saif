namespace ClouthesShop.Application.DTOs.Auth;

public record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string ConfirmPassword,
    string? PhoneNumber = null
);

public record LoginRequest(
    string Email,
    string Password
);

public record RefreshTokenRequest(
    string RefreshToken
);

public record AuthResponse(
    Guid UserId,
    string Email,
    string FullName,
    string Role,
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt
);

public record UserProfileResponse(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string Role,
    bool IsEmailVerified,
    DateTime CreatedAt
);

public record UpdateProfileRequest(
    string FirstName,
    string LastName,
    string? PhoneNumber
);
