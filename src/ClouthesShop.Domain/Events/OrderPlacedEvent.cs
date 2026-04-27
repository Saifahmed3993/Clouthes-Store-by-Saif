using ClouthesShop.Domain.Entities;

namespace ClouthesShop.Domain.Events;

public sealed class OrderPlacedEvent : IDomainEvent
{
    public Guid OrderId { get; }
    public Guid UserId { get; }
    public decimal TotalAmount { get; }
    public DateTime OccurredAt { get; } = DateTime.UtcNow;

    public OrderPlacedEvent(Guid orderId, Guid userId, decimal totalAmount)
    {
        OrderId = orderId;
        UserId = userId;
        TotalAmount = totalAmount;
    }
}
