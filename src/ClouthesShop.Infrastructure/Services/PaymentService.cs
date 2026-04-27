using ClouthesShop.Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;

namespace ClouthesShop.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IConfiguration _config;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(IConfiguration config, ILogger<PaymentService> logger)
    {
        _config = config;
        _logger = logger;
        StripeConfiguration.ApiKey = config["Stripe:SecretKey"];
    }

    public async Task<PaymentResult> CreatePaymentIntentAsync(
        decimal amount, string currency, Guid orderId, string customerEmail,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = currency.ToLowerInvariant(),
                AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
                Metadata = new Dictionary<string, string>
                {
                    { "orderId", orderId.ToString() },
                    { "customerEmail", customerEmail }
                },
                ReceiptEmail = customerEmail
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options, cancellationToken: cancellationToken);
            _logger.LogInformation("PaymentIntent created: {IntentId} for order {OrderId}", intent.Id, orderId);
            return new PaymentResult(true, intent.Id, intent.ClientSecret, null);
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe error creating PaymentIntent for order {OrderId}", orderId);
            return new PaymentResult(false, null, null, ex.Message);
        }
    }

    public async Task<RefundResult> RefundPaymentAsync(string paymentIntentId, decimal? amount = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var options = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId,
                Amount = amount.HasValue ? (long)(amount.Value * 100) : null
            };

            var service = new RefundService();
            var refund = await service.CreateAsync(options, cancellationToken: cancellationToken);
            _logger.LogInformation("Refund created: {RefundId} for PaymentIntent {IntentId}", refund.Id, paymentIntentId);
            return new RefundResult(true, refund.Id, null);
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Stripe refund error for PaymentIntent {IntentId}", paymentIntentId);
            return new RefundResult(false, null, ex.Message);
        }
    }

    public Task<bool> ValidateWebhookAsync(string payload, string signature, CancellationToken cancellationToken = default)
    {
        try
        {
            var webhookSecret = _config["Stripe:WebhookSecret"];
            var stripeEvent = EventUtility.ConstructEvent(payload, signature, webhookSecret);
            return Task.FromResult(stripeEvent is not null);
        }
        catch (StripeException ex)
        {
            _logger.LogWarning(ex, "Webhook signature validation failed");
            return Task.FromResult(false);
        }
    }

    public async Task<string?> GetPaymentIntentStatusAsync(string paymentIntentId, CancellationToken cancellationToken = default)
    {
        try
        {
            var service = new PaymentIntentService();
            var intent = await service.GetAsync(paymentIntentId, cancellationToken: cancellationToken);
            return intent.Status;
        }
        catch (StripeException ex)
        {
            _logger.LogError(ex, "Error fetching PaymentIntent status for {IntentId}", paymentIntentId);
            return null;
        }
    }
}
