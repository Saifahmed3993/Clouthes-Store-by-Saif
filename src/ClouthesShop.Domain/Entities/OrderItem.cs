namespace ClouthesShop.Domain.Entities;

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; private set; }
    public Order Order { get; private set; } = null!;
    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = null!;
    public Guid? VariantId { get; private set; }
    public ProductVariant? Variant { get; private set; }
    public string ProductName { get; private set; } = string.Empty;
    public string? VariantDescription { get; private set; }
    public string? ProductImageUrl { get; private set; }
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }

    public decimal SubTotal => UnitPrice * Quantity;

    private OrderItem() { }

    public static OrderItem Create(
        Guid productId,
        Guid? variantId,
        string productName,
        string? variantDescription,
        string? productImageUrl,
        decimal unitPrice,
        int quantity)
    {
        if (quantity <= 0) throw new Exceptions.DomainException("Quantity must be at least 1.");
        if (unitPrice < 0) throw new Exceptions.DomainException("Unit price cannot be negative.");

        return new OrderItem
        {
            ProductId = productId,
            VariantId = variantId,
            ProductName = productName,
            VariantDescription = variantDescription,
            ProductImageUrl = productImageUrl,
            UnitPrice = unitPrice,
            Quantity = quantity
        };
    }

    internal void SetOrderId(Guid orderId) => OrderId = orderId;
}
