using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Payments;
using ClouthesShop.Application.Features.Payments.Commands;
using ClouthesShop.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace ClouthesShop.API.Controllers.v1;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class PaymentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;
    private readonly IConfiguration _config;
    private readonly IUnitOfWork _uow;

    public PaymentsController(IMediator mediator, ICurrentUserService currentUser, IConfiguration config, IUnitOfWork uow)
    {
        _mediator = mediator;
        _currentUser = currentUser;
        _config = config;
        _uow = uow;
    }

    /// <summary>Create a Stripe PaymentIntent for an order</summary>
    [HttpPost("intent")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request, CancellationToken ct)
    {
        var result = await _mediator.Send(
            new CreatePaymentIntentCommand(request.OrderId, _currentUser.UserId!.Value), ct);
        return Ok(result);
    }

    /// <summary>Stripe webhook endpoint — receives payment events from Stripe</summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> StripeWebhook(CancellationToken ct)
    {
        var payload = await new StreamReader(Request.Body).ReadToEndAsync(ct);
        var signature = Request.Headers["Stripe-Signature"].ToString();
        var webhookSecret = _config["Stripe:WebhookSecret"];

        try
        {
            var stripeEvent = EventUtility.ConstructEvent(payload, signature, webhookSecret);

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded":
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    if (paymentIntent is not null)
                    {
                        var order = await _uow.Orders.GetByPaymentIntentIdAsync(paymentIntent.Id, ct);
                        if (order is not null)
                        {
                            order.MarkAsPaid(paymentIntent.Id);
                            _uow.Orders.Update(order);
                            await _uow.SaveChangesAsync(ct);
                        }
                    }
                    break;

                case "payment_intent.payment_failed":
                    // Log the failure; optionally notify the user via email
                    break;
            }

            return Ok(new { received = true });
        }
        catch (StripeException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
