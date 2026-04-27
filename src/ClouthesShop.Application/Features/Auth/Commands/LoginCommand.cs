using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Auth;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(IUnitOfWork uow, ITokenService tokenService)
    {
        _uow = uow;
        _tokenService = tokenService;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _uow.Users.GetByEmailAsync(request.Email, cancellationToken)
            ?? throw new UnauthorizedException("Invalid credentials.");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid credentials.");

        var tokens = _tokenService.GenerateTokens(user);
        user.SetRefreshToken(tokens.RefreshToken, DateTime.UtcNow.AddDays(30));
        await _uow.SaveChangesAsync(cancellationToken);

        return new AuthResponse(
            user.Id, user.Email, user.FullName,
            user.Role.ToString(), tokens.AccessToken, tokens.RefreshToken, tokens.ExpiresAt);
    }
}
