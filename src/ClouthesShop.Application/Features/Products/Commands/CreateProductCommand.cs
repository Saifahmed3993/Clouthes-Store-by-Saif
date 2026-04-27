using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Products;
using ClouthesShop.Application.Features.Products.Queries;
using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Products.Commands;

public record CreateProductCommand(
    string Name,
    string Description,
    decimal BasePrice,
    Guid CategoryId,
    int StockQuantity,
    List<CreateProductVariantRequest>? Variants,
    List<string>? ImageUrls
) : IRequest<ProductResponse>;

public sealed class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly ICacheService _cacheService;

    public CreateProductCommandHandler(IUnitOfWork uow, ICacheService cacheService)
    {
        _uow = uow;
        _cacheService = cacheService;
    }

    public async Task<ProductResponse> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        if (!await _uow.Categories.ExistsAsync(c => c.Id == request.CategoryId && c.IsActive, cancellationToken))
            throw new NotFoundException(nameof(Category), request.CategoryId);

        var product = Product.Create(
            request.Name, request.Description, request.BasePrice,
            request.CategoryId, request.StockQuantity);

        var imageUrls = request.ImageUrls ?? new List<string>();
        for (int i = 0; i < imageUrls.Count; i++)
            product.AddImage(imageUrls[i], i == 0);

        foreach (var variant in request.Variants ?? new List<CreateProductVariantRequest>())
            product.AddVariant(variant.Size, variant.Color, variant.PriceAdjustment, variant.StockQuantity);

        await _uow.Products.AddAsync(product, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);
        await _cacheService.RemoveByPatternAsync("products:*", cancellationToken);

        var created = await _uow.Products.GetByIdWithDetailsAsync(product.Id, cancellationToken);
        return GetProductByIdQueryHandler.MapToResponse(created!);
    }
}
