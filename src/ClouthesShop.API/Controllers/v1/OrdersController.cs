using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Orders;
using ClouthesShop.Application.Features.Orders.Commands;
using ClouthesShop.Application.Features.Orders.Queries;
using ClouthesShop.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ClouthesShop.API.Controllers.v1;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;

    public OrdersController(IMediator mediator, ICurrentUserService currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    /// <summary>Create order from current cart</summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken ct)
    {
        if (!Enum.TryParse<PaymentMethod>(request.PaymentMethod, true, out var paymentMethod))
            return BadRequest(new { error = "Invalid payment method. Use: CashOnDelivery or Stripe" });

        var result = await _mediator.Send(new CreateOrderCommand(
            _currentUser.UserId!.Value, request.ShippingAddress, paymentMethod, request.Notes), ct);
        return CreatedAtAction(nameof(GetOrder), new { id = result.Id }, result);
    }

    /// <summary>Get a single order by ID</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetOrder(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new GetOrderByIdQuery(id, _currentUser.UserId!.Value, _currentUser.IsAdmin), ct);
        return Ok(result);
    }

    /// <summary>Get authenticated user's order history</summary>
    [HttpGet("my")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMyOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        OrderStatus? orderStatus = null;
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<OrderStatus>(status, true, out var parsed))
            orderStatus = parsed;

        var result = await _mediator.Send(
            new GetMyOrdersQuery(_currentUser.UserId!.Value, page, pageSize, orderStatus), ct);
        return Ok(result);
    }

    /// <summary>Get all orders (Admin only)</summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllOrders(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? status = null,
        CancellationToken ct = default)
    {
        OrderStatus? orderStatus = null;
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<OrderStatus>(status, true, out var parsed))
            orderStatus = parsed;

        var result = await _mediator.Send(new GetAllOrdersQuery(page, pageSize, orderStatus), ct);
        return Ok(result);
    }

    /// <summary>Update order status (Admin only)</summary>
    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateOrderStatusRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(new UpdateOrderStatusCommand(
            id, _currentUser.UserId!.Value, true, request.Status, request.TrackingNumber), ct);
        return Ok(result);
    }

    /// <summary>Cancel an order</summary>
    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> CancelOrder(Guid id, CancellationToken ct)
    {
        var result = await _mediator.Send(new CancelOrderCommand(id, _currentUser.UserId!.Value), ct);
        return Ok(result);
    }
}
