namespace ClouthesShop.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = null!;
    public string Size { get; private set; } = string.Empty;
    public string Color { get; private set; } = string.Empty;
    public decimal? PriceAdjustment { get; private set; }
    public int StockQuantity { get; private set; }
    public string? Sku { get; private set; }

    private ProductVariant() { }

    public static ProductVariant Create(Guid productId, string size, string color, decimal? priceAdjustment, int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(size)) throw new Exceptions.DomainException("Size is required.");
        if (string.IsNullOrWhiteSpace(color)) throw new Exceptions.DomainException("Color is required.");
        if (stockQuantity < 0) throw new Exceptions.DomainException("Stock quantity cannot be negative.");

        return new ProductVariant
        {
            ProductId = productId,
            Size = size.Trim().ToUpperInvariant(),
            Color = color.Trim().ToLowerInvariant(),
            PriceAdjustment = priceAdjustment,
            StockQuantity = stockQuantity,
            Sku = GenerateSku(productId, size, color)
        };
    }

    public void UpdateStock(int quantity)
    {
        if (quantity < 0) throw new Exceptions.DomainException("Stock cannot be negative.");
        StockQuantity = quantity;
        SetUpdatedAt();
    }

    public void DecreaseStock(int quantity)
    {
        if (StockQuantity < quantity) throw new Exceptions.DomainException($"Insufficient variant stock. Available: {StockQuantity}.");
        StockQuantity -= quantity;
        SetUpdatedAt();
    }

    private static string GenerateSku(Guid productId, string size, string color) =>
        $"{productId.ToString()[..8].ToUpperInvariant()}-{size.ToUpperInvariant()}-{color.ToUpperInvariant()[..Math.Min(3, color.Length)]}";
}
