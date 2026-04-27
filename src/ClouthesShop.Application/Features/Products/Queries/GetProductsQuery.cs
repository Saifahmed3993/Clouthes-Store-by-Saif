using ClouthesShop.Application.Common.Behaviors;
using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.DTOs.Products;
using ClouthesShop.Application.Common.Models;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Products.Queries;

public record GetProductsQuery(
    string? Search,
    Guid? CategoryId,
    decimal? MinPrice,
    decimal? MaxPrice,
    string? SortBy,
    bool Descending,
    int Page,
    int PageSize
) : IRequest<PagedResult<ProductSummaryResponse>>, ICacheable
{
    public string CacheKey => $"products:{Search}:{CategoryId}:{MinPrice}:{MaxPrice}:{SortBy}:{Descending}:{Page}:{PageSize}";
    public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(5);
}

public sealed class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, PagedResult<ProductSummaryResponse>>
{
    private readonly IUnitOfWork _uow;

    public GetProductsQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<PagedResult<ProductSummaryResponse>> Handle(
        GetProductsQuery request, CancellationToken cancellationToken)
    {
        var (items, total) = await _uow.Products.GetPagedAsync(
            request.Page, request.PageSize, request.Search, request.CategoryId,
            request.MinPrice, request.MaxPrice, request.SortBy, request.Descending, cancellationToken);

        var responses = items.Select(p => new ProductSummaryResponse(
            p.Id, p.Name, p.Slug, p.BasePrice, p.CategoryId,
            p.Category?.Name ?? string.Empty, p.IsActive, p.StockQuantity,
            p.AverageRating, p.ReviewCount,
            p.Images.FirstOrDefault(i => i.IsPrimary)?.Url ?? p.Images.FirstOrDefault()?.Url
        )).ToList();

        return PagedResult<ProductSummaryResponse>.Create(responses, total, request.Page, request.PageSize);
    }
}
