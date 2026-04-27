namespace ClouthesShop.Domain.ValueObjects;

public sealed class Money : IEquatable<Money>
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency = "USD")
    {
        if (amount < 0) throw new Exceptions.DomainException("Amount cannot be negative.");
        if (string.IsNullOrWhiteSpace(currency)) throw new Exceptions.DomainException("Currency is required.");
        Amount = Math.Round(amount, 2);
        Currency = currency.ToUpperInvariant();
    }

    public Money Add(Money other)
    {
        if (Currency != other.Currency) throw new Exceptions.DomainException("Cannot add money in different currencies.");
        return new Money(Amount + other.Amount, Currency);
    }

    public Money Subtract(Money other)
    {
        if (Currency != other.Currency) throw new Exceptions.DomainException("Cannot subtract money in different currencies.");
        return new Money(Amount - other.Amount, Currency);
    }

    public Money Multiply(decimal factor) => new Money(Amount * factor, Currency);

    public override string ToString() => $"{Amount:F2} {Currency}";

    public bool Equals(Money? other)
    {
        if (other is null) return false;
        return Amount == other.Amount && Currency == other.Currency;
    }

    public override bool Equals(object? obj) => obj is Money money && Equals(money);
    public override int GetHashCode() => HashCode.Combine(Amount, Currency);
    public static bool operator ==(Money? left, Money? right) => Equals(left, right);
    public static bool operator !=(Money? left, Money? right) => !Equals(left, right);
    public static Money operator +(Money left, Money right) => left.Add(right);
    public static Money operator -(Money left, Money right) => left.Subtract(right);
}
