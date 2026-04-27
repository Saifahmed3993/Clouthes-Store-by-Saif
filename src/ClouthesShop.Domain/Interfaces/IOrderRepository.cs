using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Enums;

namespace ClouthesShop.Domain.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedByUserAsync(
        Guid userId, int page, int pageSize, OrderStatus? status,
        CancellationToken cancellationToken = default);
    Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, OrderStatus? status,
        CancellationToken cancellationToken = default);
    Task<Order?> GetByPaymentIntentIdAsync(string paymentIntentId, CancellationToken cancellationToken = default);
}
