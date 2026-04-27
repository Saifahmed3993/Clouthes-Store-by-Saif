namespace ClouthesShop.Application.DTOs.Products;

public record ProductVariantResponse(
    Guid Id,
    string Size,
    string Color,
    decimal? PriceAdjustment,
    int StockQuantity,
    string? Sku
);

public record ProductImageResponse(
    Guid Id,
    string Url,
    bool IsPrimary,
    int SortOrder
);

public record ProductResponse(
    Guid Id,
    string Name,
    string Slug,
    string Description,
    decimal BasePrice,
    Guid CategoryId,
    string CategoryName,
    bool IsActive,
    int StockQuantity,
    double AverageRating,
    int ReviewCount,
    List<ProductVariantResponse> Variants,
    List<ProductImageResponse> Images,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record ProductSummaryResponse(
    Guid Id,
    string Name,
    string Slug,
    decimal BasePrice,
    Guid CategoryId,
    string CategoryName,
    bool IsActive,
    int StockQuantity,
    double AverageRating,
    int ReviewCount,
    string? PrimaryImageUrl
);

public record CreateProductRequest(
    string Name,
    string Description,
    decimal BasePrice,
    Guid CategoryId,
    int StockQuantity,
    List<CreateProductVariantRequest>? Variants = null,
    List<string>? ImageUrls = null
);

public record CreateProductVariantRequest(
    string Size,
    string Color,
    decimal? PriceAdjustment,
    int StockQuantity
);

public record UpdateProductRequest(
    string Name,
    string Description,
    decimal BasePrice,
    Guid CategoryId,
    int StockQuantity
);

public record ProductFilterRequest(
    string? Search = null,
    Guid? CategoryId = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null,
    string? SortBy = null,
    bool Descending = false,
    int Page = 1,
    int PageSize = 20
);
