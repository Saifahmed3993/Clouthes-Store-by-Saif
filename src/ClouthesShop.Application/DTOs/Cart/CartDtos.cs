namespace ClouthesShop.Application.DTOs.Cart;

public record CartItemResponse(
    Guid Id,
    Guid ProductId,
    string ProductName,
    Guid? VariantId,
    string? VariantDescription,
    decimal UnitPrice,
    int Quantity,
    decimal SubTotal,
    string? ImageUrl
);

public record CartResponse(
    Guid Id,
    List<CartItemResponse> Items,
    decimal TotalAmount,
    int TotalItems
);

public record AddToCartRequest(
    Guid ProductId,
    Guid? VariantId,
    int Quantity
);

public record UpdateCartItemRequest(
    int Quantity
);
