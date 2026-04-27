using ClouthesShop.Application.Common.Models;
using ClouthesShop.Application.DTOs.Reviews;
using ClouthesShop.Application.Features.Reviews.Commands;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Reviews.Queries;

public record GetProductReviewsQuery(Guid ProductId, int Page, int PageSize) : IRequest<PagedResult<ReviewResponse>>;

public sealed class GetProductReviewsQueryHandler : IRequestHandler<GetProductReviewsQuery, PagedResult<ReviewResponse>>
{
    private readonly IUnitOfWork _uow;

    public GetProductReviewsQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<ReviewResponse>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken)
    {
        var (items, total) = await _uow.Reviews.GetPagedByProductAsync(
            request.ProductId, request.Page, request.PageSize, cancellationToken);

        var userIds = items.Select(r => r.UserId).Distinct().ToList();
        var users = new Dictionary<Guid, string>();
        foreach (var uid in userIds)
        {
            var user = await _uow.Users.GetByIdAsync(uid, cancellationToken);
            if (user is not null) users[uid] = user.FullName;
        }

        var responses = items
            .Select(r => CreateReviewCommandHandler.MapToResponse(r, users.GetValueOrDefault(r.UserId, "Unknown")))
            .ToList();

        return PagedResult<ReviewResponse>.Create(responses, total, request.Page, request.PageSize);
    }
}
