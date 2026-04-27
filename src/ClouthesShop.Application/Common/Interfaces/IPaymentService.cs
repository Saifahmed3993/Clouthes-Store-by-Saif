namespace ClouthesShop.Application.Common.Interfaces;

public record PaymentResult(bool IsSuccess, string? PaymentIntentId, string? ClientSecret, string? ErrorMessage);
public record RefundResult(bool IsSuccess, string? RefundId, string? ErrorMessage);

public interface IPaymentService
{
    Task<PaymentResult> CreatePaymentIntentAsync(decimal amount, string currency, Guid orderId, string customerEmail, CancellationToken cancellationToken = default);
    Task<RefundResult> RefundPaymentAsync(string paymentIntentId, decimal? amount = null, CancellationToken cancellationToken = default);
    Task<bool> ValidateWebhookAsync(string payload, string signature, CancellationToken cancellationToken = default);
    Task<string?> GetPaymentIntentStatusAsync(string paymentIntentId, CancellationToken cancellationToken = default);
}
