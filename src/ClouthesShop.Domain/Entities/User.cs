using ClouthesShop.Domain.Enums;

namespace ClouthesShop.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public UserRole Role { get; private set; } = UserRole.Customer;
    public string? PhoneNumber { get; private set; }
    public bool IsEmailVerified { get; private set; }
    public string? RefreshToken { get; private set; }
    public DateTime? RefreshTokenExpiresAt { get; private set; }

    private readonly List<Order> _orders = new();
    public IReadOnlyCollection<Order> Orders => _orders.AsReadOnly();

    private readonly List<Review> _reviews = new();
    public IReadOnlyCollection<Review> Reviews => _reviews.AsReadOnly();

    public Cart? Cart { get; private set; }

    // EF constructor
    private User() { }

    public static User Create(string firstName, string lastName, string email, string passwordHash, UserRole role = UserRole.Customer)
    {
        if (string.IsNullOrWhiteSpace(firstName)) throw new Domain.Exceptions.DomainException("First name is required.");
        if (string.IsNullOrWhiteSpace(lastName)) throw new Domain.Exceptions.DomainException("Last name is required.");
        if (string.IsNullOrWhiteSpace(email)) throw new Domain.Exceptions.DomainException("Email is required.");
        if (string.IsNullOrWhiteSpace(passwordHash)) throw new Domain.Exceptions.DomainException("Password hash is required.");

        return new User
        {
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            Email = email.Trim().ToLowerInvariant(),
            PasswordHash = passwordHash,
            Role = role
        };
    }

    public void UpdateProfile(string firstName, string lastName, string? phoneNumber)
    {
        FirstName = firstName.Trim();
        LastName = lastName.Trim();
        PhoneNumber = phoneNumber;
        SetUpdatedAt();
    }

    public void SetRefreshToken(string token, DateTime expiresAt)
    {
        RefreshToken = token;
        RefreshTokenExpiresAt = expiresAt;
        SetUpdatedAt();
    }

    public void RevokeRefreshToken()
    {
        RefreshToken = null;
        RefreshTokenExpiresAt = null;
        SetUpdatedAt();
    }

    public void VerifyEmail()
    {
        IsEmailVerified = true;
        SetUpdatedAt();
    }

    public void PromoteToAdmin()
    {
        Role = UserRole.Admin;
        SetUpdatedAt();
    }

    public string FullName => $"{FirstName} {LastName}";

    public bool IsRefreshTokenValid(string token) =>
        RefreshToken == token && RefreshTokenExpiresAt.HasValue && RefreshTokenExpiresAt.Value > DateTime.UtcNow;
}
