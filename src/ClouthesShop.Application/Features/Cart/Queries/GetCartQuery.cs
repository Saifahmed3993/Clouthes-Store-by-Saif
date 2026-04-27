using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.DTOs.Cart;
using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Cart.Queries;

public record GetCartQuery(Guid UserId) : IRequest<CartResponse>;

public sealed class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartResponse>
{
    private readonly IUnitOfWork _uow;

    public GetCartQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CartResponse> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _uow.Carts.GetByUserIdAsync(request.UserId, cancellationToken);

        if (cart is null)
        {
            cart = Domain.Entities.Cart.Create(request.UserId);
            await _uow.Carts.AddAsync(cart, cancellationToken);
            await _uow.SaveChangesAsync(cancellationToken);
        }

        return MapToResponse(cart);
    }

    public static CartResponse MapToResponse(Domain.Entities.Cart cart) => new(
        cart.Id,
        cart.Items.Select(i => new CartItemResponse(
            i.Id, i.ProductId, i.ProductName, i.VariantId,
            i.Variant != null ? $"{i.Variant.Size} / {i.Variant.Color}" : null,
            i.UnitPrice, i.Quantity, i.SubTotal, i.ImageUrl)).ToList(),
        cart.TotalAmount,
        cart.TotalItems);
}
