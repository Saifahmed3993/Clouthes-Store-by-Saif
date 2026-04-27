using MediatR;
using Microsoft.Extensions.Logging;
using ClouthesShop.Application.Common.Interfaces;

namespace ClouthesShop.Application.Common.Behaviors;

public interface ICacheable
{
    string CacheKey { get; }
    TimeSpan? CacheExpiration { get; }
}

public sealed class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ICacheService _cacheService;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(ICacheService cacheService, ILogger<CachingBehavior<TRequest, TResponse>> logger)
    {
        _cacheService = cacheService;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request is not ICacheable cacheable)
            return await next();

        var cached = await _cacheService.GetAsync<TResponse>(cacheable.CacheKey, cancellationToken);
        if (cached is not null)
        {
            _logger.LogDebug("Cache hit for key: {CacheKey}", cacheable.CacheKey);
            return cached;
        }

        var response = await next();
        await _cacheService.SetAsync(cacheable.CacheKey, response, cacheable.CacheExpiration, cancellationToken);
        _logger.LogDebug("Cache set for key: {CacheKey}", cacheable.CacheKey);
        return response;
    }
}
