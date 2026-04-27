namespace ClouthesShop.Domain.Entities;

public class Review : BaseEntity
{
    public Guid ProductId { get; private set; }
    public Product Product { get; private set; } = null!;
    public Guid UserId { get; private set; }
    public User User { get; private set; } = null!;
    public int Rating { get; private set; }
    public string? Comment { get; private set; }
    public bool IsVerifiedPurchase { get; private set; }
    public bool IsApproved { get; private set; }

    private Review() { }

    public static Review Create(Guid productId, Guid userId, int rating, string? comment, bool isVerifiedPurchase = false)
    {
        if (rating < 1 || rating > 5) throw new Exceptions.DomainException("Rating must be between 1 and 5.");

        return new Review
        {
            ProductId = productId,
            UserId = userId,
            Rating = rating,
            Comment = comment?.Trim(),
            IsVerifiedPurchase = isVerifiedPurchase
        };
    }

    public void Update(int rating, string? comment)
    {
        if (rating < 1 || rating > 5) throw new Exceptions.DomainException("Rating must be between 1 and 5.");
        Rating = rating;
        Comment = comment?.Trim();
        SetUpdatedAt();
    }

    public void Approve()
    {
        IsApproved = true;
        SetUpdatedAt();
    }

    public void Reject()
    {
        IsApproved = false;
        SetUpdatedAt();
    }
}
