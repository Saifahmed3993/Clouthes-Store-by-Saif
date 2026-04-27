using ClouthesShop.Domain.Entities;

namespace ClouthesShop.Domain.Interfaces;

public interface ICartRepository : IRepository<Cart>
{
    Task<Cart?> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Cart?> GetByIdWithItemsAsync(Guid cartId, CancellationToken cancellationToken = default);
}
