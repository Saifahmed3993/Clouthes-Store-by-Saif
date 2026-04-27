using ClouthesShop.Domain.Enums;
using ClouthesShop.Domain.Events;
using ClouthesShop.Domain.ValueObjects;

namespace ClouthesShop.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; private set; } = string.Empty;
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
    public OrderStatus Status { get; private set; } = OrderStatus.Pending;
    public decimal SubTotal { get; private set; }
    public decimal ShippingCost { get; private set; }
    public decimal TaxAmount { get; private set; }
    public decimal TotalAmount { get; private set; }
    public PaymentMethod PaymentMethod { get; private set; }
    public string? PaymentIntentId { get; private set; }
    public bool IsPaid { get; private set; }
    public DateTime? PaidAt { get; private set; }
    public DateTime? ShippedAt { get; private set; }
    public DateTime? DeliveredAt { get; private set; }
    public string? TrackingNumber { get; private set; }
    public string? Notes { get; private set; }
    public Address ShippingAddress { get; private set; } = null!;

    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    private Order() { }

    public static Order Create(
        Guid userId,
        Address shippingAddress,
        PaymentMethod paymentMethod,
        IEnumerable<OrderItem> items,
        decimal shippingCost = 0,
        decimal taxRate = 0.1m,
        string? notes = null)
    {
        var itemList = items.ToList();
        if (!itemList.Any()) throw new Exceptions.DomainException("Order must have at least one item.");

        var subTotal = itemList.Sum(i => i.UnitPrice * i.Quantity);
        var taxAmount = Math.Round(subTotal * taxRate, 2);
        var total = subTotal + shippingCost + taxAmount;

        var order = new Order
        {
            OrderNumber = GenerateOrderNumber(),
            UserId = userId,
            ShippingAddress = shippingAddress,
            PaymentMethod = paymentMethod,
            SubTotal = subTotal,
            ShippingCost = shippingCost,
            TaxAmount = taxAmount,
            TotalAmount = total,
            Notes = notes
        };

        foreach (var item in itemList)
            order._items.Add(item);

        order.AddDomainEvent(new OrderPlacedEvent(order.Id, userId, total));
        return order;
    }

    public void MarkAsPaid(string? paymentIntentId = null)
    {
        if (IsPaid) throw new Exceptions.DomainException("Order is already paid.");
        IsPaid = true;
        PaidAt = DateTime.UtcNow;
        Status = OrderStatus.Paid;
        PaymentIntentId = paymentIntentId;
        SetUpdatedAt();
        AddDomainEvent(new PaymentCompletedEvent(Id, UserId, TotalAmount));
    }

    public void StartProcessing()
    {
        if (Status != OrderStatus.Paid) throw new Exceptions.DomainException("Order must be paid before processing.");
        Status = OrderStatus.Processing;
        SetUpdatedAt();
    }

    public void MarkAsShipped(string trackingNumber)
    {
        if (Status != OrderStatus.Processing) throw new Exceptions.DomainException("Order must be in Processing state to ship.");
        if (string.IsNullOrWhiteSpace(trackingNumber)) throw new Exceptions.DomainException("Tracking number is required.");
        Status = OrderStatus.Shipped;
        TrackingNumber = trackingNumber;
        ShippedAt = DateTime.UtcNow;
        SetUpdatedAt();
    }

    public void MarkAsDelivered()
    {
        if (Status != OrderStatus.Shipped) throw new Exceptions.DomainException("Order must be shipped before delivery.");
        Status = OrderStatus.Delivered;
        DeliveredAt = DateTime.UtcNow;
        SetUpdatedAt();
    }

    public void Cancel()
    {
        if (Status is OrderStatus.Shipped or OrderStatus.Delivered)
            throw new Exceptions.DomainException("Cannot cancel a shipped or delivered order.");
        Status = OrderStatus.Cancelled;
        SetUpdatedAt();
    }

    public void Refund()
    {
        if (Status == OrderStatus.Refunded) throw new Exceptions.DomainException("Order is already refunded.");
        Status = OrderStatus.Refunded;
        SetUpdatedAt();
    }

    private static string GenerateOrderNumber() =>
        $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpperInvariant()}";
}
