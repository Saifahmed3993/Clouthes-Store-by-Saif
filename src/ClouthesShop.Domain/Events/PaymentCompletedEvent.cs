using ClouthesShop.Domain.Entities;

namespace ClouthesShop.Domain.Events;

public sealed class PaymentCompletedEvent : IDomainEvent
{
    public Guid OrderId { get; }
    public Guid UserId { get; }
    public decimal AmountPaid { get; }
    public DateTime OccurredAt { get; } = DateTime.UtcNow;

    public PaymentCompletedEvent(Guid orderId, Guid userId, decimal amountPaid)
    {
        OrderId = orderId;
        UserId = userId;
        AmountPaid = amountPaid;
    }
}
