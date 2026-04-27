namespace ClouthesShop.Domain.Entities;

public class ProductImage : BaseEntity
{
    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = null!;
    public string Url { get; private set; } = string.Empty;
    public bool IsPrimary { get; private set; }
    public int SortOrder { get; private set; }

    private ProductImage() { }

    public static ProductImage Create(Guid productId, string url, bool isPrimary = false, int sortOrder = 0)
    {
        if (string.IsNullOrWhiteSpace(url)) throw new Exceptions.DomainException("Image URL is required.");
        return new ProductImage
        {
            ProductId = productId,
            Url = url.Trim(),
            IsPrimary = isPrimary,
            SortOrder = sortOrder
        };
    }

    public void SetAsPrimary()
    {
        IsPrimary = true;
        SetUpdatedAt();
    }
}
