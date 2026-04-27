namespace ClouthesShop.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public decimal BasePrice { get; private set; }
    public Guid CategoryId { get; private set; }
    public Category Category { get; private set; } = null!;
    public bool IsActive { get; private set; } = true;
    public int StockQuantity { get; private set; }
    public double AverageRating { get; private set; }
    public int ReviewCount { get; private set; }

    private readonly List<ProductVariant> _variants = new();
    public IReadOnlyCollection<ProductVariant> Variants => _variants.AsReadOnly();

    private readonly List<ProductImage> _images = new();
    public IReadOnlyCollection<ProductImage> Images => _images.AsReadOnly();

    private readonly List<Review> _reviews = new();
    public IReadOnlyCollection<Review> Reviews => _reviews.AsReadOnly();

    private Product() { }

    public static Product Create(
        string name,
        string description,
        decimal basePrice,
        Guid categoryId,
        int stockQuantity = 0)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new Exceptions.DomainException("Product name is required.");
        if (string.IsNullOrWhiteSpace(description)) throw new Exceptions.DomainException("Product description is required.");
        if (basePrice < 0) throw new Exceptions.DomainException("Price cannot be negative.");
        if (stockQuantity < 0) throw new Exceptions.DomainException("Stock quantity cannot be negative.");

        return new Product
        {
            Name = name.Trim(),
            Slug = GenerateSlug(name),
            Description = description.Trim(),
            BasePrice = basePrice,
            CategoryId = categoryId,
            StockQuantity = stockQuantity
        };
    }

    public void Update(string name, string description, decimal basePrice, Guid categoryId, int stockQuantity)
    {
        if (basePrice < 0) throw new Exceptions.DomainException("Price cannot be negative.");
        if (stockQuantity < 0) throw new Exceptions.DomainException("Stock quantity cannot be negative.");

        Name = name.Trim();
        Slug = GenerateSlug(name);
        Description = description.Trim();
        BasePrice = basePrice;
        CategoryId = categoryId;
        StockQuantity = stockQuantity;
        SetUpdatedAt();
    }

    public void AddImage(string url, bool isPrimary = false) =>
        _images.Add(ProductImage.Create(Id, url, isPrimary));

    public void AddVariant(string size, string color, decimal? priceAdjustment, int stock) =>
        _variants.Add(ProductVariant.Create(Id, size, color, priceAdjustment, stock));

    public void UpdateRating(double averageRating, int reviewCount)
    {
        AverageRating = averageRating;
        ReviewCount = reviewCount;
        SetUpdatedAt();
    }

    public void DecreaseStock(int quantity)
    {
        if (quantity <= 0) throw new Exceptions.DomainException("Quantity must be positive.");
        if (StockQuantity < quantity) throw new Exceptions.DomainException($"Insufficient stock. Available: {StockQuantity}.");
        StockQuantity -= quantity;
        SetUpdatedAt();
    }

    public void IncreaseStock(int quantity)
    {
        if (quantity <= 0) throw new Exceptions.DomainException("Quantity must be positive.");
        StockQuantity += quantity;
        SetUpdatedAt();
    }

    public void Deactivate()
    {
        IsActive = false;
        SetUpdatedAt();
    }

    public void Activate()
    {
        IsActive = true;
        SetUpdatedAt();
    }

    private static string GenerateSlug(string name) =>
        name.Trim().ToLowerInvariant().Replace(" ", "-").Replace("_", "-");
}
