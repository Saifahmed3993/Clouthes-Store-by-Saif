using ClouthesShop.Domain.Entities;

namespace ClouthesShop.Domain.Interfaces;

public interface IReviewRepository : IRepository<Review>
{
    Task<(IEnumerable<Review> Items, int TotalCount)> GetPagedByProductAsync(
        Guid productId, int page, int pageSize,
        CancellationToken cancellationToken = default);
    Task<Review?> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken cancellationToken = default);
    Task<(double AverageRating, int Count)> GetProductRatingStatsAsync(Guid productId, CancellationToken cancellationToken = default);
}
