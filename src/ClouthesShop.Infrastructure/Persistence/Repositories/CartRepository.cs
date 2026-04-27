using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClouthesShop.Infrastructure.Persistence.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default) =>
        await _dbSet
            .Include(c => c.Items).ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);

    public async Task<Cart?> GetByIdWithItemsAsync(Guid cartId, CancellationToken cancellationToken = default) =>
        await _dbSet
            .Include(c => c.Items).ThenInclude(i => i.Variant)
            .FirstOrDefaultAsync(c => c.Id == cartId, cancellationToken);
}
