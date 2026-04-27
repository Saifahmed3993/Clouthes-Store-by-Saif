using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Orders;
using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Enums;
using ClouthesShop.Domain.Interfaces;
using ClouthesShop.Domain.ValueObjects;
using MediatR;

namespace ClouthesShop.Application.Features.Orders.Commands;

public record CreateOrderCommand(
    Guid UserId,
    AddressDto ShippingAddress,
    PaymentMethod PaymentMethod,
    string? Notes
) : IRequest<OrderResponse>;

public sealed class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, OrderResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _emailService;

    public CreateOrderCommandHandler(IUnitOfWork uow, IEmailService emailService)
    {
        _uow = uow;
        _emailService = emailService;
    }

    public async Task<OrderResponse> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var cart = await _uow.Carts.GetByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException("Cart is empty or not found.");

        if (!cart.Items.Any())
            throw new Domain.Exceptions.DomainException("Cannot create an order from an empty cart.");

        var user = await _uow.Users.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(User), request.UserId);

        // Validate stock and build order items
        var orderItems = new List<OrderItem>();
        foreach (var cartItem in cart.Items)
        {
            var product = await _uow.Products.GetByIdWithDetailsAsync(cartItem.ProductId, cancellationToken)
                ?? throw new NotFoundException(nameof(Product), cartItem.ProductId);

            if (!product.IsActive)
                throw new Domain.Exceptions.DomainException($"Product '{product.Name}' is no longer available.");

            if (product.StockQuantity < cartItem.Quantity)
                throw new Domain.Exceptions.DomainException($"Insufficient stock for '{product.Name}'. Available: {product.StockQuantity}.");

            string? variantDescription = null;
            if (cartItem.VariantId.HasValue)
            {
                var variant = product.Variants.FirstOrDefault(v => v.Id == cartItem.VariantId.Value);
                if (variant != null)
                {
                    variantDescription = $"{variant.Size} / {variant.Color}";
                    variant.DecreaseStock(cartItem.Quantity);
                }
            }

            product.DecreaseStock(cartItem.Quantity);
            _uow.Products.Update(product);

            orderItems.Add(OrderItem.Create(
                cartItem.ProductId, cartItem.VariantId,
                cartItem.ProductName, variantDescription, cartItem.ImageUrl,
                cartItem.UnitPrice, cartItem.Quantity));
        }

        var address = new Address(
            request.ShippingAddress.Street, request.ShippingAddress.City,
            request.ShippingAddress.State, request.ShippingAddress.ZipCode,
            request.ShippingAddress.Country);

        var shippingCost = CalculateShipping(cart.TotalAmount);
        var order = Order.Create(request.UserId, address, request.PaymentMethod, orderItems, shippingCost, 0.1m, request.Notes);

        await _uow.Orders.AddAsync(order, cancellationToken);

        if (request.PaymentMethod == PaymentMethod.CashOnDelivery)
            order.MarkAsPaid();

        cart.Clear();
        await _uow.SaveChangesAsync(cancellationToken);

        _ = _emailService.SendOrderConfirmationAsync(user.Email, user.FullName, order.OrderNumber, order.TotalAmount, cancellationToken);

        var created = await _uow.Orders.GetByIdWithDetailsAsync(order.Id, cancellationToken);
        return MapOrderToResponse(created!);
    }

    private static decimal CalculateShipping(decimal subtotal) => subtotal >= 100m ? 0m : 9.99m;

    public static OrderResponse MapOrderToResponse(Order o) => new(
        o.Id, o.OrderNumber, o.Status, o.Status.ToString(),
        o.SubTotal, o.ShippingCost, o.TaxAmount, o.TotalAmount,
        o.PaymentMethod.ToString(), o.IsPaid, o.PaidAt, o.ShippedAt, o.DeliveredAt,
        o.TrackingNumber, o.Notes,
        new AddressDto(o.ShippingAddress.Street, o.ShippingAddress.City,
            o.ShippingAddress.State, o.ShippingAddress.ZipCode, o.ShippingAddress.Country),
        o.Items.Select(i => new OrderItemResponse(
            i.Id, i.ProductId, i.ProductName, i.VariantId, i.VariantDescription,
            i.ProductImageUrl, i.UnitPrice, i.Quantity, i.SubTotal)).ToList(),
        o.CreatedAt);
}
