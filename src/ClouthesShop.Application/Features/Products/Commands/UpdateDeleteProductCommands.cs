using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Products;
using ClouthesShop.Application.Features.Products.Queries;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Products.Commands;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Description,
    decimal BasePrice,
    Guid CategoryId,
    int StockQuantity
) : IRequest<ProductResponse>;

public sealed class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, ProductResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly ICacheService _cacheService;

    public UpdateProductCommandHandler(IUnitOfWork uow, ICacheService cacheService)
    {
        _uow = uow;
        _cacheService = cacheService;
    }

    public async Task<ProductResponse> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _uow.Products.GetByIdWithDetailsAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Product), request.Id);

        if (!await _uow.Categories.ExistsAsync(c => c.Id == request.CategoryId && c.IsActive, cancellationToken))
            throw new NotFoundException(nameof(Domain.Entities.Category), request.CategoryId);

        product.Update(request.Name, request.Description, request.BasePrice, request.CategoryId, request.StockQuantity);
        _uow.Products.Update(product);
        await _uow.SaveChangesAsync(cancellationToken);

        await _cacheService.RemoveAsync($"product:{product.Id}", cancellationToken);
        await _cacheService.RemoveAsync($"product-slug:{product.Slug}", cancellationToken);
        await _cacheService.RemoveByPatternAsync("products:*", cancellationToken);

        return GetProductByIdQueryHandler.MapToResponse(product);
    }
}

public record DeleteProductCommand(Guid Id) : IRequest<Unit>;

public sealed class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, Unit>
{
    private readonly IUnitOfWork _uow;
    private readonly ICacheService _cacheService;

    public DeleteProductCommandHandler(IUnitOfWork uow, ICacheService cacheService)
    {
        _uow = uow;
        _cacheService = cacheService;
    }

    public async Task<Unit> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _uow.Products.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Product), request.Id);

        product.Deactivate();
        _uow.Products.Update(product);
        await _uow.SaveChangesAsync(cancellationToken);
        await _cacheService.RemoveAsync($"product:{product.Id}", cancellationToken);
        await _cacheService.RemoveByPatternAsync("products:*", cancellationToken);
        return Unit.Value;
    }
}
