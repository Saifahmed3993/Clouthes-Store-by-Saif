using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Auth;
using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Auth.Commands;

public record RegisterCommand(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string ConfirmPassword,
    string? PhoneNumber = null
) : IRequest<AuthResponse>;

public sealed class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;

    public RegisterCommandHandler(IUnitOfWork uow, ITokenService tokenService, IEmailService emailService)
    {
        _uow = uow;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        if (await _uow.Users.EmailExistsAsync(request.Email, cancellationToken))
            throw new ConflictException($"Email '{request.Email}' is already registered.");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);
        var user = User.Create(request.FirstName, request.LastName, request.Email, passwordHash);

        if (!string.IsNullOrWhiteSpace(request.PhoneNumber))
            user.UpdateProfile(user.FirstName, user.LastName, request.PhoneNumber);

        await _uow.Users.AddAsync(user, cancellationToken);

        var tokens = _tokenService.GenerateTokens(user);
        user.SetRefreshToken(tokens.RefreshToken, DateTime.UtcNow.AddDays(30));

        await _uow.SaveChangesAsync(cancellationToken);

        _ = _emailService.SendWelcomeEmailAsync(user.Email, user.FullName, cancellationToken);

        return new AuthResponse(
            user.Id, user.Email, user.FullName,
            user.Role.ToString(), tokens.AccessToken, tokens.RefreshToken, tokens.ExpiresAt);
    }
}
