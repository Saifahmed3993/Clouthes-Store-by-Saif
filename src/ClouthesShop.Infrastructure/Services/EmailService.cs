using ClouthesShop.Application.Common.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;

namespace ClouthesShop.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendOrderConfirmationAsync(string toEmail, string userName, string orderNumber, decimal totalAmount, CancellationToken cancellationToken = default)
    {
        var subject = $"Order Confirmation - {orderNumber}";
        var body = $"""
            <h2>Thank you for your order, {userName}!</h2>
            <p>Your order <strong>{orderNumber}</strong> has been received and is being processed.</p>
            <p>Total Amount: <strong>${totalAmount:F2}</strong></p>
            <p>We'll notify you when your order ships.</p>
            <br/><p>The ClouthesShop Team</p>
            """;
        await SendGenericEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string userName, CancellationToken cancellationToken = default)
    {
        var subject = "Welcome to ClouthesShop!";
        var body = $"""
            <h2>Welcome, {userName}!</h2>
            <p>Thank you for creating an account with ClouthesShop.</p>
            <p>Start shopping our premium t-shirt collection today.</p>
            <br/><p>The ClouthesShop Team</p>
            """;
        await SendGenericEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendPasswordResetAsync(string toEmail, string userName, string resetLink, CancellationToken cancellationToken = default)
    {
        var subject = "Password Reset Request";
        var body = $"""
            <h2>Password Reset</h2>
            <p>Hi {userName}, you requested a password reset.</p>
            <p><a href="{resetLink}">Click here to reset your password</a></p>
            <p>This link expires in 1 hour. If you did not request this, please ignore this email.</p>
            """;
        await SendGenericEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendShippingNotificationAsync(string toEmail, string userName, string orderNumber, string trackingNumber, CancellationToken cancellationToken = default)
    {
        var subject = $"Your Order {orderNumber} Has Shipped!";
        var body = $"""
            <h2>Your order is on its way, {userName}!</h2>
            <p>Order <strong>{orderNumber}</strong> has been shipped.</p>
            <p>Tracking Number: <strong>{trackingNumber}</strong></p>
            <p>Estimated delivery: 3-5 business days.</p>
            <br/><p>The ClouthesShop Team</p>
            """;
        await SendGenericEmailAsync(toEmail, subject, body, cancellationToken);
    }

    public async Task SendGenericEmailAsync(string toEmail, string subject, string body, CancellationToken cancellationToken = default)
    {
        try
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(emailSettings["FromName"], emailSettings["FromEmail"]));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = subject;
            message.Body = new TextPart(TextFormat.Html) { Text = body };

            using var client = new SmtpClient();
            await client.ConnectAsync(
                emailSettings["SmtpHost"],
                int.Parse(emailSettings["SmtpPort"] ?? "587"),
                SecureSocketOptions.StartTls, cancellationToken);

            if (!string.IsNullOrWhiteSpace(emailSettings["SmtpUser"]))
                await client.AuthenticateAsync(emailSettings["SmtpUser"], emailSettings["SmtpPassword"], cancellationToken);

            await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            _logger.LogInformation("Email sent to {Email}: {Subject}", toEmail, subject);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}: {Subject}", toEmail, subject);
        }
    }
}
