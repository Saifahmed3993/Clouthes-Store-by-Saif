using ClouthesShop.Domain.Enums;

namespace ClouthesShop.Application.DTOs.Orders;

public record OrderItemResponse(
    Guid Id,
    Guid ProductId,
    string ProductName,
    Guid? VariantId,
    string? VariantDescription,
    string? ProductImageUrl,
    decimal UnitPrice,
    int Quantity,
    decimal SubTotal
);

public record AddressDto(
    string Street,
    string City,
    string State,
    string ZipCode,
    string Country
);

public record OrderResponse(
    Guid Id,
    string OrderNumber,
    OrderStatus Status,
    string StatusDisplay,
    decimal SubTotal,
    decimal ShippingCost,
    decimal TaxAmount,
    decimal TotalAmount,
    string PaymentMethod,
    bool IsPaid,
    DateTime? PaidAt,
    DateTime? ShippedAt,
    DateTime? DeliveredAt,
    string? TrackingNumber,
    string? Notes,
    AddressDto ShippingAddress,
    List<OrderItemResponse> Items,
    DateTime CreatedAt
);

public record OrderSummaryResponse(
    Guid Id,
    string OrderNumber,
    OrderStatus Status,
    string StatusDisplay,
    decimal TotalAmount,
    string PaymentMethod,
    bool IsPaid,
    int ItemCount,
    DateTime CreatedAt
);

public record CreateOrderRequest(
    AddressDto ShippingAddress,
    string PaymentMethod,
    string? Notes = null
);

public record UpdateOrderStatusRequest(
    string Status,
    string? TrackingNumber = null
);
