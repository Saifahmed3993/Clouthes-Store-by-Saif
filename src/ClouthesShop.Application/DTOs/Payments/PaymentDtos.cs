namespace ClouthesShop.Application.DTOs.Payments;

public record CreatePaymentIntentRequest(
    Guid OrderId
);

public record PaymentIntentResponse(
    string PaymentIntentId,
    string ClientSecret,
    decimal Amount,
    string Currency
);

public record WebhookRequest(
    string Payload,
    string Signature
);
