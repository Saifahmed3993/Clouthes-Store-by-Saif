namespace ClouthesShop.Domain.Entities;

public interface IDomainEvent
{
    DateTime OccurredAt { get; }
}
