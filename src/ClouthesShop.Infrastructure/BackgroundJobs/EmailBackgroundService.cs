using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace ClouthesShop.Infrastructure.BackgroundJobs;

public record EmailJob(string ToEmail, string Subject, string Body);

public interface IEmailQueue
{
    void EnqueueEmail(EmailJob job);
    bool TryDequeue(out EmailJob? job);
}

public class EmailQueue : IEmailQueue
{
    private readonly ConcurrentQueue<EmailJob> _queue = new();

    public void EnqueueEmail(EmailJob job) => _queue.Enqueue(job);

    public bool TryDequeue(out EmailJob? job) => _queue.TryDequeue(out job);
}

public class EmailBackgroundService : BackgroundService
{
    private readonly IEmailQueue _queue;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<EmailBackgroundService> _logger;

    public EmailBackgroundService(
        IEmailQueue queue,
        IServiceProvider serviceProvider,
        ILogger<EmailBackgroundService> logger)
    {
        _queue = queue;
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Email background service started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            if (_queue.TryDequeue(out var job) && job is not null)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
                    await emailService.SendGenericEmailAsync(job.ToEmail, job.Subject, job.Body, stoppingToken);
                    _logger.LogInformation("Background email sent to {Email}", job.ToEmail);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Background email failed to {Email}", job?.ToEmail);
                }
            }
            else
            {
                await Task.Delay(500, stoppingToken);
            }
        }
    }
}
