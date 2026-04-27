namespace ClouthesShop.Application.DTOs.Reviews;

public record ReviewResponse(
    Guid Id,
    Guid ProductId,
    Guid UserId,
    string UserName,
    int Rating,
    string? Comment,
    bool IsVerifiedPurchase,
    bool IsApproved,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);

public record CreateReviewRequest(
    Guid ProductId,
    int Rating,
    string? Comment
);

public record UpdateReviewRequest(
    int Rating,
    string? Comment
);
