using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Orders;
using ClouthesShop.Application.Features.Orders.Commands;
using ClouthesShop.Domain.Enums;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Orders.Commands;

public record UpdateOrderStatusCommand(Guid OrderId, Guid RequestingUserId, bool IsAdmin, string Status, string? TrackingNumber = null) : IRequest<OrderResponse>;

public sealed class UpdateOrderStatusCommandHandler : IRequestHandler<UpdateOrderStatusCommand, OrderResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _emailService;

    public UpdateOrderStatusCommandHandler(IUnitOfWork uow, IEmailService emailService)
    {
        _uow = uow;
        _emailService = emailService;
    }

    public async Task<OrderResponse> Handle(UpdateOrderStatusCommand request, CancellationToken cancellationToken)
    {
        var order = await _uow.Orders.GetByIdWithDetailsAsync(request.OrderId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Order), request.OrderId);

        if (!request.IsAdmin && order.UserId != request.RequestingUserId)
            throw new UnauthorizedException();

        switch (request.Status.ToUpperInvariant())
        {
            case "PROCESSING": order.StartProcessing(); break;
            case "SHIPPED":
                if (string.IsNullOrWhiteSpace(request.TrackingNumber))
                    throw new Domain.Exceptions.DomainException("Tracking number is required for shipping.");
                order.MarkAsShipped(request.TrackingNumber!);
                var user = await _uow.Users.GetByIdAsync(order.UserId, cancellationToken);
                if (user is not null)
                    _ = _emailService.SendShippingNotificationAsync(user.Email, user.FullName, order.OrderNumber, request.TrackingNumber!, cancellationToken);
                break;
            case "DELIVERED": order.MarkAsDelivered(); break;
            case "CANCELLED": order.Cancel(); break;
            default: throw new Domain.Exceptions.DomainException($"Unknown status: {request.Status}");
        }

        _uow.Orders.Update(order);
        await _uow.SaveChangesAsync(cancellationToken);
        return CreateOrderCommandHandler.MapOrderToResponse(order);
    }
}

public record CancelOrderCommand(Guid OrderId, Guid UserId) : IRequest<OrderResponse>;

public sealed class CancelOrderCommandHandler : IRequestHandler<CancelOrderCommand, OrderResponse>
{
    private readonly IUnitOfWork _uow;

    public CancelOrderCommandHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<OrderResponse> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var order = await _uow.Orders.GetByIdWithDetailsAsync(request.OrderId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Order), request.OrderId);

        if (order.UserId != request.UserId)
            throw new UnauthorizedException("You can only cancel your own orders.");

        order.Cancel();
        _uow.Orders.Update(order);
        await _uow.SaveChangesAsync(cancellationToken);
        return CreateOrderCommandHandler.MapOrderToResponse(order);
    }
}
