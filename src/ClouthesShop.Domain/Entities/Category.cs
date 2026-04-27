namespace ClouthesShop.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public bool IsActive { get; private set; } = true;

    private readonly List<Product> _products = new();
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

    private Category() { }

    public static Category Create(string name, string? description = null, string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new Exceptions.DomainException("Category name is required.");

        return new Category
        {
            Name = name.Trim(),
            Slug = GenerateSlug(name),
            Description = description?.Trim(),
            ImageUrl = imageUrl
        };
    }

    public void Update(string name, string? description, string? imageUrl)
    {
        Name = name.Trim();
        Slug = GenerateSlug(name);
        Description = description?.Trim();
        ImageUrl = imageUrl;
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
