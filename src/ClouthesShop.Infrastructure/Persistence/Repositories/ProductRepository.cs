using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClouthesShop.Infrastructure.Persistence.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

    public async Task<(IEnumerable<Product> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, string? search, Guid? categoryId,
        decimal? minPrice, decimal? maxPrice, string? sortBy, bool descending,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Where(p => p.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.Contains(search) || p.Description.Contains(search));

        if (categoryId.HasValue)
            query = query.Where(p => p.CategoryId == categoryId.Value);

        if (minPrice.HasValue)
            query = query.Where(p => p.BasePrice >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(p => p.BasePrice <= maxPrice.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        query = sortBy?.ToLowerInvariant() switch
        {
            "price" => descending ? query.OrderByDescending(p => p.BasePrice) : query.OrderBy(p => p.BasePrice),
            "name" => descending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "rating" => descending ? query.OrderByDescending(p => p.AverageRating) : query.OrderBy(p => p.AverageRating),
            "newest" => query.OrderByDescending(p => p.CreatedAt),
            _ => query.OrderByDescending(p => p.CreatedAt)
        };

        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return (items, totalCount);
    }

    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default) =>
        await _dbSet
            .Include(p => p.Category)
            .Include(p => p.Variants)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default) =>
        excludeId.HasValue
            ? await _dbSet.AnyAsync(p => p.Slug == slug && p.Id != excludeId.Value, cancellationToken)
            : await _dbSet.AnyAsync(p => p.Slug == slug, cancellationToken);
}
