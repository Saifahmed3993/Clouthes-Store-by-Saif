using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Cart;
using ClouthesShop.Application.Features.Cart.Commands;
using ClouthesShop.Application.Features.Cart.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClouthesShop.API.Controllers.v1;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public CartController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    /// <summary>Get the current user's cart</summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCart(CancellationToken ct) =>
        Ok(await _mediator.Send(new GetCartQuery(_currentUser.UserId!.Value), ct));

    /// <summary>Add an item to the cart</summary>
    [HttpPost("items")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new AddToCartCommand(_currentUser.UserId!.Value, request.ProductId, request.VariantId, request.Quantity), ct);
        return Ok(result);
    }

    /// <summary>Update the quantity of a cart item</summary>
    [HttpPut("items/{itemId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCartItem(Guid itemId, [FromBody] UpdateCartItemRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new UpdateCartItemCommand(_currentUser.UserId!.Value, itemId, request.Quantity), ct);
        return Ok(result);
    }

    /// <summary>Remove an item from the cart</summary>
    [HttpDelete("items/{itemId:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RemoveFromCart(Guid itemId, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new RemoveFromCartCommand(_currentUser.UserId!.Value, itemId), ct);
        return Ok(result);
    }

    /// <summary>Clear all items from the cart</summary>
    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ClearCart(CancellationToken ct)
    {
        await _mediator.Send(new ClearCartCommand(_currentUser.UserId!.Value), ct);
        return NoContent();
    }
}
