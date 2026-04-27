namespace ClouthesShop.Domain.ValueObjects;

public sealed class Address : IEquatable<Address>
{
    public string Street { get; }
    public string City { get; }
    public string State { get; }
    public string ZipCode { get; }
    public string Country { get; }

    private Address() { Street = City = State = ZipCode = Country = string.Empty; }

    public Address(string street, string city, string state, string zipCode, string country)
    {
        if (string.IsNullOrWhiteSpace(street)) throw new Exceptions.DomainException("Street is required.");
        if (string.IsNullOrWhiteSpace(city)) throw new Exceptions.DomainException("City is required.");
        if (string.IsNullOrWhiteSpace(state)) throw new Exceptions.DomainException("State is required.");
        if (string.IsNullOrWhiteSpace(zipCode)) throw new Exceptions.DomainException("Zip code is required.");
        if (string.IsNullOrWhiteSpace(country)) throw new Exceptions.DomainException("Country is required.");

        Street = street.Trim();
        City = city.Trim();
        State = state.Trim();
        ZipCode = zipCode.Trim();
        Country = country.Trim();
    }

    public override string ToString() => $"{Street}, {City}, {State} {ZipCode}, {Country}";

    public bool Equals(Address? other)
    {
        if (other is null) return false;
        return Street == other.Street && City == other.City &&
               State == other.State && ZipCode == other.ZipCode && Country == other.Country;
    }

    public override bool Equals(object? obj) => obj is Address address && Equals(address);

    public override int GetHashCode() =>
        HashCode.Combine(Street, City, State, ZipCode, Country);

    public static bool operator ==(Address? left, Address? right) => Equals(left, right);
    public static bool operator !=(Address? left, Address? right) => !Equals(left, right);
}
