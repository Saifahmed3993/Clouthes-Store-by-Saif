using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Enums;
using ClouthesShop.Domain.Exceptions;
using FluentAssertions;

namespace ClouthesShop.Domain.Tests.Entities;

public class UserTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateUser()
    {
        var user = User.Create("John", "Doe", "john@example.com", "hashed_password");

        user.FirstName.Should().Be("John");
        user.LastName.Should().Be("Doe");
        user.Email.Should().Be("john@example.com");
        user.Role.Should().Be(UserRole.Customer);
        user.IsEmailVerified.Should().BeFalse();
    }

    [Theory]
    [InlineData("", "Doe", "john@example.com", "password")]
    [InlineData("John", "", "john@example.com", "password")]
    [InlineData("John", "Doe", "", "password")]
    [InlineData("John", "Doe", "john@example.com", "")]
    public void Create_WithInvalidData_ShouldThrowDomainException(string first, string last, string email, string hash)
    {
        var action = () => User.Create(first, last, email, hash);
        action.Should().Throw<DomainException>();
    }

    [Fact]
    public void Email_ShouldBeNormalized_ToLowerCase()
    {
        var user = User.Create("Jane", "Doe", "JANE@EXAMPLE.COM", "hash");
        user.Email.Should().Be("jane@example.com");
    }

    [Fact]
    public void FullName_ShouldCombineFirstAndLastName()
    {
        var user = User.Create("Jane", "Smith", "jane@example.com", "hash");
        user.FullName.Should().Be("Jane Smith");
    }

    [Fact]
    public void SetRefreshToken_ShouldUpdateTokenAndExpiry()
    {
        var user = User.Create("John", "Doe", "john@example.com", "hash");
        var expiry = DateTime.UtcNow.AddDays(7);
        user.SetRefreshToken("token123", expiry);

        user.RefreshToken.Should().Be("token123");
        user.RefreshTokenExpiresAt.Should().BeCloseTo(expiry, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void IsRefreshTokenValid_WithExpiredToken_ShouldReturnFalse()
    {
        var user = User.Create("John", "Doe", "john@example.com", "hash");
        user.SetRefreshToken("token123", DateTime.UtcNow.AddDays(-1));

        user.IsRefreshTokenValid("token123").Should().BeFalse();
    }

    [Fact]
    public void IsRefreshTokenValid_WithWrongToken_ShouldReturnFalse()
    {
        var user = User.Create("John", "Doe", "john@example.com", "hash");
        user.SetRefreshToken("correct_token", DateTime.UtcNow.AddDays(7));

        user.IsRefreshTokenValid("wrong_token").Should().BeFalse();
    }

    [Fact]
    public void RevokeRefreshToken_ShouldClearToken()
    {
        var user = User.Create("John", "Doe", "john@example.com", "hash");
        user.SetRefreshToken("token", DateTime.UtcNow.AddDays(7));
        user.RevokeRefreshToken();

        user.RefreshToken.Should().BeNull();
        user.RefreshTokenExpiresAt.Should().BeNull();
    }
}

public class ProductTests
{
    [Fact]
    public void Create_WithValidData_ShouldCreateProduct()
    {
        var categoryId = Guid.NewGuid();
        var product = Product.Create("Test Tee", "A great tee", 29.99m, categoryId, 100);

        product.Name.Should().Be("Test Tee");
        product.BasePrice.Should().Be(29.99m);
        product.StockQuantity.Should().Be(100);
        product.IsActive.Should().BeTrue();
    }

    [Fact]
    public void Create_WithNegativePrice_ShouldThrowDomainException()
    {
        var action = () => Product.Create("Test", "Desc", -1m, Guid.NewGuid(), 10);
        action.Should().Throw<DomainException>().WithMessage("*negative*");
    }

    [Fact]
    public void DecreaseStock_WithSufficientStock_ShouldDecreaseByQuantity()
    {
        var product = Product.Create("Tee", "Desc", 29.99m, Guid.NewGuid(), 50);
        product.DecreaseStock(10);
        product.StockQuantity.Should().Be(40);
    }

    [Fact]
    public void DecreaseStock_WithInsufficientStock_ShouldThrowDomainException()
    {
        var product = Product.Create("Tee", "Desc", 29.99m, Guid.NewGuid(), 5);
        var action = () => product.DecreaseStock(10);
        action.Should().Throw<DomainException>().WithMessage("*Insufficient*");
    }

    [Fact]
    public void Deactivate_ShouldSetIsActiveToFalse()
    {
        var product = Product.Create("Tee", "Desc", 29.99m, Guid.NewGuid(), 10);
        product.Deactivate();
        product.IsActive.Should().BeFalse();
    }

    [Fact]
    public void Slug_ShouldBeGeneratedFromName()
    {
        var product = Product.Create("My Awesome Tee", "Desc", 29.99m, Guid.NewGuid(), 10);
        product.Slug.Should().Be("my-awesome-tee");
    }
}

public class OrderTests
{
    [Fact]
    public void Cancel_WhenPending_ShouldSucceed()
    {
        var order = CreateTestOrder();
        order.Cancel();
        order.Status.Should().Be(OrderStatus.Cancelled);
    }

    [Fact]
    public void MarkAsShipped_WhenNotProcessing_ShouldThrowDomainException()
    {
        var order = CreateTestOrder();
        var action = () => order.MarkAsShipped("TRACK123");
        action.Should().Throw<DomainException>();
    }

    [Fact]
    public void MarkAsPaid_ShouldSetIsPaidAndStatus()
    {
        var order = CreateTestOrder();
        order.MarkAsPaid("pi_test123");
        order.IsPaid.Should().BeTrue();
        order.Status.Should().Be(OrderStatus.Paid);
        order.PaymentIntentId.Should().Be("pi_test123");
    }

    [Fact]
    public void MarkAsPaid_WhenAlreadyPaid_ShouldThrowDomainException()
    {
        var order = CreateTestOrder();
        order.MarkAsPaid();
        var action = () => order.MarkAsPaid();
        action.Should().Throw<DomainException>().WithMessage("*already paid*");
    }

    [Fact]
    public void FullOrderLifecycle_ShouldSucceed()
    {
        var order = CreateTestOrder();
        order.MarkAsPaid("pi_123");
        order.StartProcessing();
        order.MarkAsShipped("FEDEX-001");
        order.MarkAsDelivered();

        order.Status.Should().Be(OrderStatus.Delivered);
        order.DeliveredAt.Should().NotBeNull();
        order.TrackingNumber.Should().Be("FEDEX-001");
    }

    private static Order CreateTestOrder()
    {
        var items = new List<OrderItem>
        {
            OrderItem.Create(Guid.NewGuid(), null, "Test Tee", null, null, 29.99m, 2)
        };
        var address = new Domain.ValueObjects.Address("123 Main St", "NYC", "NY", "10001", "US");
        return Order.Create(Guid.NewGuid(), address, PaymentMethod.Stripe, items);
    }
}

public class CartTests
{
    [Fact]
    public void AddItem_NewItem_ShouldAddToCart()
    {
        var cart = Cart.Create(Guid.NewGuid());
        var productId = Guid.NewGuid();
        cart.AddItem(productId, null, "Test Tee", 29.99m, 2, null);

        cart.Items.Should().HaveCount(1);
        cart.TotalItems.Should().Be(2);
        cart.TotalAmount.Should().Be(59.98m);
    }

    [Fact]
    public void AddItem_ExistingItem_ShouldIncreaseQuantity()
    {
        var cart = Cart.Create(Guid.NewGuid());
        var productId = Guid.NewGuid();
        cart.AddItem(productId, null, "Test Tee", 29.99m, 1, null);
        cart.AddItem(productId, null, "Test Tee", 29.99m, 2, null);

        cart.Items.Should().HaveCount(1);
        cart.Items.First().Quantity.Should().Be(3);
    }

    [Fact]
    public void Clear_ShouldRemoveAllItems()
    {
        var cart = Cart.Create(Guid.NewGuid());
        cart.AddItem(Guid.NewGuid(), null, "Tee 1", 29.99m, 1, null);
        cart.AddItem(Guid.NewGuid(), null, "Tee 2", 39.99m, 1, null);
        cart.Clear();

        cart.Items.Should().BeEmpty();
        cart.TotalAmount.Should().Be(0);
    }
}
