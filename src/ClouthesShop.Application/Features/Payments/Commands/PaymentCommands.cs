using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Payments;
using ClouthesShop.Application.Features.Orders.Commands;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Payments.Commands;

public record CreatePaymentIntentCommand(Guid OrderId, Guid UserId) : IRequest<PaymentIntentResponse>;

public sealed class CreatePaymentIntentCommandHandler : IRequestHandler<CreatePaymentIntentCommand, PaymentIntentResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly IPaymentService _paymentService;

    public CreatePaymentIntentCommandHandler(IUnitOfWork uow, IPaymentService paymentService)
    {
        _uow = uow;
        _paymentService = paymentService;
    }

    public async Task<PaymentIntentResponse> Handle(CreatePaymentIntentCommand request, CancellationToken cancellationToken)
    {
        var order = await _uow.Orders.GetByIdWithDetailsAsync(request.OrderId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Order), request.OrderId);

        if (order.UserId != request.UserId)
            throw new UnauthorizedException();

        if (order.IsPaid)
            throw new Domain.Exceptions.DomainException("Order is already paid.");

        var user = await _uow.Users.GetByIdAsync(request.UserId, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.User), request.UserId);

        var result = await _paymentService.CreatePaymentIntentAsync(
            order.TotalAmount, "usd", order.Id, user.Email, cancellationToken);

        if (!result.IsSuccess)
            throw new Domain.Exceptions.DomainException($"Payment failed: {result.ErrorMessage}");

        return new PaymentIntentResponse(result.PaymentIntentId!, result.ClientSecret!, order.TotalAmount, "USD");
    }
}

public record HandleStripeWebhookCommand(string Payload, string Signature) : IRequest<Unit>;

public sealed class HandleStripeWebhookCommandHandler : IRequestHandler<HandleStripeWebhookCommand, Unit>
{
    private readonly IUnitOfWork _uow;
    private readonly IPaymentService _paymentService;
    private readonly IEmailService _emailService;

    public HandleStripeWebhookCommandHandler(IUnitOfWork uow, IPaymentService paymentService, IEmailService emailService)
    {
        _uow = uow;
        _paymentService = paymentService;
        _emailService = emailService;
    }

    public async Task<Unit> Handle(HandleStripeWebhookCommand request, CancellationToken cancellationToken)
    {
        var isValid = await _paymentService.ValidateWebhookAsync(request.Payload, request.Signature, cancellationToken);
        if (!isValid) throw new UnauthorizedException("Invalid webhook signature.");

        // Stripe event parsing happens inside Infrastructure; here we respond to a confirmed payment
        // The Infrastructure layer triggers the domain logic via the PaymentService
        return Unit.Value;
    }
}
