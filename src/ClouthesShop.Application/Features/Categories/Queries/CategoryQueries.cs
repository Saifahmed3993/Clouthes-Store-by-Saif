using ClouthesShop.Application.Common.Behaviors;
using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.DTOs.Categories;
using ClouthesShop.Application.Features.Categories.Commands;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Categories.Queries;

public record GetCategoriesQuery : IRequest<List<CategoryResponse>>, ICacheable
{
    public string CacheKey => "categories:all";
    public TimeSpan? CacheExpiration => TimeSpan.FromMinutes(30);
}

public sealed class GetCategoriesQueryHandler : IRequestHandler<GetCategoriesQuery, List<CategoryResponse>>
{
    private readonly IUnitOfWork _uow;

    public GetCategoriesQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<List<CategoryResponse>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _uow.Categories.GetActiveAsync(cancellationToken);
        return categories.Select(c => CreateCategoryCommandHandler.MapToResponse(c, c.Products.Count)).ToList();
    }
}

public record GetCategoryByIdQuery(Guid Id) : IRequest<CategoryResponse>;

public sealed class GetCategoryByIdQueryHandler : IRequestHandler<GetCategoryByIdQuery, CategoryResponse>
{
    private readonly IUnitOfWork _uow;

    public GetCategoryByIdQueryHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<CategoryResponse> Handle(GetCategoryByIdQuery request, CancellationToken cancellationToken)
    {
        var category = await _uow.Categories.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Category), request.Id);

        return CreateCategoryCommandHandler.MapToResponse(category, category.Products.Count);
    }
}
