using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.DTOs.Auth;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Auth.Queries;

public record GetCurrentUserQuery(Guid UserId) : IRequest<UserProfileResponse>;

public sealed class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserProfileResponse>
{
    private readonly IUnitOfWork _uow;

    public GetCurrentUserQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<UserProfileResponse> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _uow.Users.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.User), request.UserId);

        return new UserProfileResponse(
            user.Id, user.FirstName, user.LastName, user.Email,
            user.PhoneNumber, user.Role.ToString(), user.IsEmailVerified, user.CreatedAt);
    }
}
