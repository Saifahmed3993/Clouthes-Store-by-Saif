using ClouthesShop.Application.Common.Behaviors;
using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.DTOs.Products;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Products.Queries;

public record GetProductByIdQuery(Guid Id) : IRequest<ProductResponse>, ICacheable
{
    public string CacheKey => $"product:{Id}";
    public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(10);
}

public sealed class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductResponse>
{
    private readonly IUnitOfWork _uow;

    public GetProductByIdQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<ProductResponse> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        var product = await _uow.Products.GetByIdWithDetailsAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Product), request.Id);

        return MapToResponse(product);
    }

    public static ProductResponse MapToResponse(Domain.Entities.Product p) => new(
        p.Id, p.Name, p.Slug, p.Description, p.BasePrice,
        p.CategoryId, p.Category?.Name ?? string.Empty,
        p.IsActive, p.StockQuantity, p.AverageRating, p.ReviewCount,
        p.Variants.Select(v => new ProductVariantResponse(
            v.Id, v.Size, v.Color, v.PriceAdjustment, v.StockQuantity, v.Sku)).ToList(),
        p.Images.OrderBy(i => i.SortOrder).Select(i => new ProductImageResponse(
            i.Id, i.Url, i.IsPrimary, i.SortOrder)).ToList(),
        p.CreatedAt, p.UpdatedAt);
}

public record GetProductBySlugQuery(string Slug) : IRequest<ProductResponse>, ICacheable
{
    public string CacheKey => $"product-slug:{Slug}";
    public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(10);
}

public sealed class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductResponse>
{
    private readonly IUnitOfWork _uow;

    public GetProductBySlugQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<ProductResponse> Handle(GetProductBySlugQuery request, CancellationToken cancellationToken)
    {
        var product = await _uow.Products.GetBySlugAsync(request.Slug, cancellationToken)
            ?? throw new NotFoundException($"Product with slug '{request.Slug}' was not found.");

        return GetProductByIdQueryHandler.MapToResponse(product);
    }
}
