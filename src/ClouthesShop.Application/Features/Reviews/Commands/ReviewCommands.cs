using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Models;
using ClouthesShop.Application.DTOs.Reviews;
using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Reviews.Commands;

public record CreateReviewCommand(Guid UserId, Guid ProductId, int Rating, string? Comment) : IRequest<ReviewResponse>;

public sealed class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewResponse>
{
    private readonly IUnitOfWork _uow;

    public CreateReviewCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<ReviewResponse> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        if (!await _uow.Products.ExistsAsync(p => p.Id == request.ProductId && p.IsActive, cancellationToken))
            throw new NotFoundException(nameof(Product), request.ProductId);

        var existing = await _uow.Reviews.GetByUserAndProductAsync(request.UserId, request.ProductId, cancellationToken);
        if (existing is not null)
            throw new ConflictException("You have already reviewed this product.");

        // Check if verified purchase
        var hasPurchased = await _uow.Orders.ExistsAsync(
            o => o.UserId == request.UserId && o.Items.Any(i => i.ProductId == request.ProductId) && o.IsPaid,
            cancellationToken);

        var review = Review.Create(request.ProductId, request.UserId, request.Rating, request.Comment, hasPurchased);
        review.Approve(); // Auto-approve; production: switch to admin approval workflow

        await _uow.Reviews.AddAsync(review, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);

        // Update product rating
        var (avg, count) = await _uow.Reviews.GetProductRatingStatsAsync(request.ProductId, cancellationToken);
        var product = await _uow.Products.GetByIdAsync(request.ProductId, cancellationToken);
        product!.UpdateRating(avg, count);
        _uow.Products.Update(product);
        await _uow.SaveChangesAsync(cancellationToken);

        var user = await _uow.Users.GetByIdAsync(request.UserId, cancellationToken);
        return MapToResponse(review, user?.FullName ?? "Unknown");
    }

    public static ReviewResponse MapToResponse(Review r, string userName) => new(
        r.Id, r.ProductId, r.UserId, userName, r.Rating,
        r.Comment, r.IsVerifiedPurchase, r.IsApproved, r.CreatedAt, r.UpdatedAt);
}

public record UpdateReviewCommand(Guid ReviewId, Guid UserId, int Rating, string? Comment) : IRequest<ReviewResponse>;

public sealed class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, ReviewResponse>
{
    private readonly IUnitOfWork _uow;

    public UpdateReviewCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<ReviewResponse> Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _uow.Reviews.GetByIdAsync(request.ReviewId, cancellationToken)
            ?? throw new NotFoundException(nameof(Review), request.ReviewId);

        if (review.UserId != request.UserId)
            throw new UnauthorizedException("You can only edit your own reviews.");

        review.Update(request.Rating, request.Comment);
        _uow.Reviews.Update(review);
        await _uow.SaveChangesAsync(cancellationToken);

        var (avg, count) = await _uow.Reviews.GetProductRatingStatsAsync(review.ProductId, cancellationToken);
        var product = await _uow.Products.GetByIdAsync(review.ProductId, cancellationToken);
        product!.UpdateRating(avg, count);
        _uow.Products.Update(product);
        await _uow.SaveChangesAsync(cancellationToken);

        var user = await _uow.Users.GetByIdAsync(request.UserId, cancellationToken);
        return CreateReviewCommandHandler.MapToResponse(review, user?.FullName ?? "Unknown");
    }
}

public record DeleteReviewCommand(Guid ReviewId, Guid UserId, bool IsAdmin) : IRequest<Unit>;

public sealed class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, Unit>
{
    private readonly IUnitOfWork _uow;

    public DeleteReviewCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Unit> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var review = await _uow.Reviews.GetByIdAsync(request.ReviewId, cancellationToken)
            ?? throw new NotFoundException(nameof(Review), request.ReviewId);

        if (!request.IsAdmin && review.UserId != request.UserId)
            throw new UnauthorizedException("You can only delete your own reviews.");

        _uow.Reviews.Remove(review);
        await _uow.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}
