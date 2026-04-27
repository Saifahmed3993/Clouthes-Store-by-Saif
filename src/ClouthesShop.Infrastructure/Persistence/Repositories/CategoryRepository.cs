using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClouthesShop.Infrastructure.Persistence.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Category?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default) =>
        await _dbSet.Include(c => c.Products).FirstOrDefaultAsync(c => c.Slug == slug, cancellationToken);

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default) =>
        excludeId.HasValue
            ? await _dbSet.AnyAsync(c => c.Slug == slug && c.Id != excludeId.Value, cancellationToken)
            : await _dbSet.AnyAsync(c => c.Slug == slug, cancellationToken);

    public async Task<IEnumerable<Category>> GetActiveAsync(CancellationToken cancellationToken = default) =>
        await _dbSet.Where(c => c.IsActive).OrderBy(c => c.Name).ToListAsync(cancellationToken);
}
