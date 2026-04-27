namespace ClouthesShop.Domain.Entities;

public class Cart : BaseEntity
{
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;

    private readonly List<CartItem> _items = new();
    public IReadOnlyCollection<CartItem> Items => _items.AsReadOnly();

    public decimal TotalAmount => _items.Sum(i => i.UnitPrice * i.Quantity);
    public int TotalItems => _items.Sum(i => i.Quantity);

    private Cart() { }

    public static Cart Create(Guid userId) =>
        new Cart { UserId = userId };

    public void AddItem(Guid productId, Guid? variantId, string productName, decimal unitPrice, int quantity, string? imageUrl)
    {
        var existingItem = _items.FirstOrDefault(i => i.ProductId == productId && i.VariantId == variantId);
        if (existingItem != null)
        {
            existingItem.IncreaseQuantity(quantity);
        }
        else
        {
            _items.Add(CartItem.Create(Id, productId, variantId, productName, unitPrice, quantity, imageUrl));
        }
        SetUpdatedAt();
    }

    public void RemoveItem(Guid cartItemId)
    {
        var item = _items.FirstOrDefault(i => i.Id == cartItemId)
            ?? throw new Exceptions.DomainException("Cart item not found.");
        _items.Remove(item);
        SetUpdatedAt();
    }

    public void UpdateItemQuantity(Guid cartItemId, int quantity)
    {
        var item = _items.FirstOrDefault(i => i.Id == cartItemId)
            ?? throw new Exceptions.DomainException("Cart item not found.");

        if (quantity <= 0)
        {
            _items.Remove(item);
        }
        else
        {
            item.SetQuantity(quantity);
        }
        SetUpdatedAt();
    }

    public void Clear()
    {
        _items.Clear();
        SetUpdatedAt();
    }
}
