using ClouthesShop.Domain.Entities;

namespace ClouthesShop.Domain.Interfaces;

public interface ICategoryRepository : IRepository<Category>
{
    Task<Category?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Category>> GetActiveAsync(CancellationToken cancellationToken = default);
}
