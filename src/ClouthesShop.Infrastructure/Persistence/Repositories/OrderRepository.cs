using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Enums;
using ClouthesShop.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ClouthesShop.Infrastructure.Persistence.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(ApplicationDbContext context) : base(context) { }

    public async Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default) =>
        await _dbSet
            .Include(o => o.Items).ThenInclude(i => i.Product)
            .Include(o => o.Items).ThenInclude(i => i.Variant)
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);

    public async Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default) =>
        await _dbSet.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber, cancellationToken);

    public async Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedByUserAsync(
        Guid userId, int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Include(o => o.Items).Where(o => o.UserId == userId);
        if (status.HasValue) query = query.Where(o => o.Status == status.Value);

        var total = await query.CountAsync(cancellationToken);
        var items = await query.OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        return (items, total);
    }

    public async Task<(IEnumerable<Order> Items, int TotalCount)> GetPagedAsync(
        int page, int pageSize, OrderStatus? status, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Include(o => o.Items).AsQueryable();
        if (status.HasValue) query = query.Where(o => o.Status == status.Value);

        var total = await query.CountAsync(cancellationToken);
        var items = await query.OrderByDescending(o => o.CreatedAt)
            .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);

        return (items, total);
    }

    public async Task<Order?> GetByPaymentIntentIdAsync(string paymentIntentId, CancellationToken cancellationToken = default) =>
        await _dbSet.FirstOrDefaultAsync(o => o.PaymentIntentId == paymentIntentId, cancellationToken);
}
