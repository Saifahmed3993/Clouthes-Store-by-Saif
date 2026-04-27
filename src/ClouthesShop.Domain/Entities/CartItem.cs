namespace ClouthesShop.Domain.Entities;

public class CartItem : BaseEntity
{
    public Guid CartId { get; private set; }
    public Cart Cart { get; private set; } = null!;
    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = null!;
    public Guid? VariantId { get; private set; }
    public ProductVariant? Variant { get; private set; }
    public string ProductName { get; private set; } = string.Empty;
    public decimal UnitPrice { get; private set; }
    public int Quantity { get; private set; }
    public string? ImageUrl { get; private set; }

    public decimal SubTotal => UnitPrice * Quantity;

    private CartItem() { }

    public static CartItem Create(
        Guid cartId, Guid productId, Guid? variantId,
        string productName, decimal unitPrice, int quantity, string? imageUrl)
    {
        if (quantity <= 0) throw new Exceptions.DomainException("Quantity must be at least 1.");
        if (unitPrice < 0) throw new Exceptions.DomainException("Unit price cannot be negative.");

        return new CartItem
        {
            CartId = cartId,
            ProductId = productId,
            VariantId = variantId,
            ProductName = productName,
            UnitPrice = unitPrice,
            Quantity = quantity,
            ImageUrl = imageUrl
        };
    }

    public void IncreaseQuantity(int amount)
    {
        if (amount <= 0) throw new Exceptions.DomainException("Amount must be positive.");
        Quantity += amount;
        SetUpdatedAt();
    }

    public void SetQuantity(int quantity)
    {
        if (quantity <= 0) throw new Exceptions.DomainException("Quantity must be at least 1.");
        Quantity = quantity;
        SetUpdatedAt();
    }
}
