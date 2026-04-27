using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Auth.Commands;

public record RevokeTokenCommand(Guid UserId) : IRequest<Unit>;

public sealed class RevokeTokenCommandHandler : IRequestHandler<RevokeTokenCommand, Unit>
{
    private readonly IUnitOfWork _uow;

    public RevokeTokenCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Unit> Handle(RevokeTokenCommand request, CancellationToken cancellationToken)
    {
        var user = await _uow.Users.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.User), request.UserId);

        user.RevokeRefreshToken();
        await _uow.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
