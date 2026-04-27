using ClouthesShop.Application.Common.Exceptions;
using ClouthesShop.Application.Common.Interfaces;
using ClouthesShop.Application.DTOs.Categories;
using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Interfaces;
using MediatR;

namespace ClouthesShop.Application.Features.Categories.Commands;

public record CreateCategoryCommand(string Name, string? Description, string? ImageUrl) : IRequest<CategoryResponse>;

public sealed class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CategoryResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly ICacheService _cache;

    public CreateCategoryCommandHandler(IUnitOfWork uow, ICacheService cache) { _uow = uow; _cache = cache; }

    public async Task<CategoryResponse> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = Category.Create(request.Name, request.Description, request.ImageUrl);
        if (await _uow.Categories.SlugExistsAsync(category.Slug, null, cancellationToken))
            throw new ConflictException($"Category with slug '{category.Slug}' already exists.");

        await _uow.Categories.AddAsync(category, cancellationToken);
        await _uow.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("categories:all", cancellationToken);

        return MapToResponse(category, 0);
    }

    public static CategoryResponse MapToResponse(Category c, int productCount) =>
        new(c.Id, c.Name, c.Slug, c.Description, c.ImageUrl, c.IsActive, productCount, c.CreatedAt);
}

public record UpdateCategoryCommand(Guid Id, string Name, string? Description, string? ImageUrl) : IRequest<CategoryResponse>;

public sealed class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, CategoryResponse>
{
    private readonly IUnitOfWork _uow;
    private readonly ICacheService _cache;

    public UpdateCategoryCommandHandler(IUnitOfWork uow, ICacheService cache) { _uow = uow; _cache = cache; }

    public async Task<CategoryResponse> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _uow.Categories.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Category), request.Id);

        category.Update(request.Name, request.Description, request.ImageUrl);
        _uow.Categories.Update(category);
        await _uow.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("categories:all", cancellationToken);

        return CreateCategoryCommandHandler.MapToResponse(category, 0);
    }
}

public record DeleteCategoryCommand(Guid Id) : IRequest<Unit>;

public sealed class DeleteCategoryCommandHandler : IRequestHandler<DeleteCategoryCommand, Unit>
{
    private readonly IUnitOfWork _uow;
    private readonly ICacheService _cache;

    public DeleteCategoryCommandHandler(IUnitOfWork uow, ICacheService cache) { _uow = uow; _cache = cache; }

    public async Task<Unit> Handle(DeleteCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = await _uow.Categories.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Category), request.Id);

        category.Deactivate();
        _uow.Categories.Update(category);
        await _uow.SaveChangesAsync(cancellationToken);
        await _cache.RemoveAsync("categories:all", cancellationToken);
        return Unit.Value;
    }
}
