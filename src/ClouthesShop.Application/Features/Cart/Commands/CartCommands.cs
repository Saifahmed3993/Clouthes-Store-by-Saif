using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.DTOs.Cart;
using ClouthesShop.Application.Features.Cart.Queries;
using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Cart.Commands;

public record AddToCartCommand(Guid UserId, Guid ProductId, Guid? VariantId, int Quantity) : IRequest<CartResponse>;

public sealed class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, CartResponse>
{
    private readonly IUnitOfWork _uow;

    public AddToCartCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CartResponse> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        var product = await _uow.Products.GetByIdWithDetailsAsync(request.ProductId, cancellationToken)
            ?? throw new NotFoundException(nameof(Product), request.ProductId);

        if (!product.IsActive) throw new Domain.Exceptions.DomainException("Product is not available.");

        decimal price = product.BasePrice;
        string? imageUrl = product.Images.FirstOrDefault(i => i.IsPrimary)?.Url ?? product.Images.FirstOrDefault()?.Url;

        if (request.VariantId.HasValue)
        {
            var variant = product.Variants.FirstOrDefault(v => v.Id == request.VariantId.Value)
                ?? throw new NotFoundException(nameof(ProductVariant), request.VariantId.Value);
            if (variant.PriceAdjustment.HasValue) price += variant.PriceAdjustment.Value;
        }

        var cart = await _uow.Carts.GetByUserIdAsync(request.UserId, cancellationToken);
        if (cart is null)
        {
            cart = Domain.Entities.Cart.Create(request.UserId);
            await _uow.Carts.AddAsync(cart, cancellationToken);
        }

        cart.AddItem(request.ProductId, request.VariantId, product.Name, price, request.Quantity, imageUrl);
        await _uow.SaveChangesAsync(cancellationToken);

        var refreshedCart = await _uow.Carts.GetByUserIdAsync(request.UserId, cancellationToken);
        return GetCartQueryHandler.MapToResponse(refreshedCart!);
    }
}

public record RemoveFromCartCommand(Guid UserId, Guid CartItemId) : IRequest<CartResponse>;

public sealed class RemoveFromCartCommandHandler : IRequestHandler<RemoveFromCartCommand, CartResponse>
{
    private readonly IUnitOfWork _uow;

    public RemoveFromCartCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CartResponse> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _uow.Carts.GetByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException("Cart not found for user.");

        cart.RemoveItem(request.CartItemId);
        await _uow.SaveChangesAsync(cancellationToken);
        return GetCartQueryHandler.MapToResponse(cart);
    }
}

public record UpdateCartItemCommand(Guid UserId, Guid CartItemId, int Quantity) : IRequest<CartResponse>;

public sealed class UpdateCartItemCommandHandler : IRequestHandler<UpdateCartItemCommand, CartResponse>
{
    private readonly IUnitOfWork _uow;

    public UpdateCartItemCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CartResponse> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        var cart = await _uow.Carts.GetByUserIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException("Cart not found for user.");

        cart.UpdateItemQuantity(request.CartItemId, request.Quantity);
        await _uow.SaveChangesAsync(cancellationToken);
        return GetCartQueryHandler.MapToResponse(cart);
    }
}

public record ClearCartCommand(Guid UserId) : IRequest<Unit>;

public sealed class ClearCartCommandHandler : IRequestHandler<ClearCartCommand, Unit>
{
    private readonly IUnitOfWork _uow;

    public ClearCartCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Unit> Handle(ClearCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _uow.Carts.GetByUserIdAsync(request.UserId, cancellationToken);
        if (cart is not null)
        {
            cart.Clear();
            await _uow.SaveChangesAsync(cancellationToken);
        }
        return Unit.Value;
    }
}
