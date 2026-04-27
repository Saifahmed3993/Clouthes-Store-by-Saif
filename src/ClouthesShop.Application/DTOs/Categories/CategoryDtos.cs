namespace ClouthesShop.Application.DTOs.Categories;

public record CategoryResponse(
    Guid Id,
    string Name,
    string Slug,
    string? Description,
    string? ImageUrl,
    bool IsActive,
    int ProductCount,
    DateTime CreatedAt
);

public record CreateCategoryRequest(
    string Name,
    string? Description = null,
    string? ImageUrl = null
);

public record UpdateCategoryRequest(
    string Name,
    string? Description = null,
    string? ImageUrl = null
);
