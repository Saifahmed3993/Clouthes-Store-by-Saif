namespace ClouthesShop.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendOrderConfirmationAsync(string toEmail, string userName, string orderNumber, decimal totalAmount, CancellationToken cancellationToken = default);
    Task SendWelcomeEmailAsync(string toEmail, string userName, CancellationToken cancellationToken = default);
    Task SendPasswordResetAsync(string toEmail, string userName, string resetLink, CancellationToken cancellationToken = default);
    Task SendShippingNotificationAsync(string toEmail, string userName, string orderNumber, string trackingNumber, CancellationToken cancellationToken = default);
    Task SendGenericEmailAsync(string toEmail, string subject, string body, CancellationToken cancellationToken = default);
}
