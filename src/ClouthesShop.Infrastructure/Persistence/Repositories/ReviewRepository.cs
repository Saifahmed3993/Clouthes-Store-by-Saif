using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClouthesShop.Infrastructure.Persistence.Repositories;

public class ReviewRepository : Repository<Review>, IReviewRepository
{
    public ReviewRepository(ApplicationDbContext context) : base(context) { }

    public async Task<(IEnumerable<Review> Items, int TotalCount)> GetPagedByProductAsync(
        Guid productId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(r => r.ProductId == productId && r.IsApproved);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return (items, total);
    }

    public async Task<Review?> GetByUserAndProductAsync(Guid userId, Guid productId, CancellationToken cancellationToken = default) =>
        await _dbSet.FirstOrDefaultAsync(r => r.UserId == userId && r.ProductId == productId, cancellationToken);

    public async Task<(double AverageRating, int Count)> GetProductRatingStatsAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        var reviews = await _dbSet.Where(r => r.ProductId == productId && r.IsApproved).ToListAsync(cancellationToken);
        if (!reviews.Any()) return (0, 0);
        return (Math.Round(reviews.Average(r => r.Rating), 2), reviews.Count);
    }
}
