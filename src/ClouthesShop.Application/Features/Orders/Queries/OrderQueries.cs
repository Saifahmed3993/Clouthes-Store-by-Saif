using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Models;
using ClouthesShop.Application.DTOs.Orders;
using ClouthesShop.Application.Features.Orders.Commands;
using ClouthesShop.Domain.Enums;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Orders.Queries;

public record GetOrderByIdQuery(Guid OrderId, Guid UserId, bool IsAdmin) : IRequest<OrderResponse>;

public sealed class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderResponse>
{
    private readonly IUnitOfWork _uow;

    public GetOrderByIdQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<OrderResponse> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _uow.Orders.GetByIdWithDetailsAsync(request.OrderId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Order), request.OrderId);

        if (!request.IsAdmin && order.UserId != request.UserId)
            throw new UnauthorizedException("You can only view your own orders.");

        return CreateOrderCommandHandler.MapOrderToResponse(order);
    }
}

public record GetMyOrdersQuery(Guid UserId, int Page, int PageSize, OrderStatus? Status) : IRequest<PagedResult<OrderSummaryResponse>>;

public sealed class GetMyOrdersQueryHandler : IRequestHandler<GetMyOrdersQuery, PagedResult<OrderSummaryResponse>>
{
    private readonly IUnitOfWork _uow;

    public GetMyOrdersQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<OrderSummaryResponse>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        var (items, total) = await _uow.Orders.GetPagedByUserAsync(
            request.UserId, request.Page, request.PageSize, request.Status, cancellationToken);

        var responses = items.Select(o => new OrderSummaryResponse(
            o.Id, o.OrderNumber, o.Status, o.Status.ToString(),
            o.TotalAmount, o.PaymentMethod.ToString(), o.IsPaid,
            o.Items.Sum(i => i.Quantity), o.CreatedAt)).ToList();

        return PagedResult<OrderSummaryResponse>.Create(responses, total, request.Page, request.PageSize);
    }
}

public record GetAllOrdersQuery(int Page, int PageSize, OrderStatus? Status) : IRequest<PagedResult<OrderSummaryResponse>>;

public sealed class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, PagedResult<OrderSummaryResponse>>
{
    private readonly IUnitOfWork _uow;

    public GetAllOrdersQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<OrderSummaryResponse>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        var (items, total) = await _uow.Orders.GetPagedAsync(
            request.Page, request.PageSize, request.Status, cancellationToken);

        var responses = items.Select(o => new OrderSummaryResponse(
            o.Id, o.OrderNumber, o.Status, o.Status.ToString(),
            o.TotalAmount, o.PaymentMethod.ToString(), o.IsPaid,
            o.Items.Sum(i => i.Quantity), o.CreatedAt)).ToList();

        return PagedResult<OrderSummaryResponse>.Create(responses, total, request.Page, request.PageSize);
    }
}
