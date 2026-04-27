using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClouthesShop.Infrastructure.Persistence.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(o => o.Id);
        builder.Property(o => o.OrderNumber).HasMaxLength(50).IsRequired();
        builder.HasIndex(o => o.OrderNumber).IsUnique();
        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(o => o.PaymentMethod).HasConversion<string>().HasMaxLength(20);
        builder.Property(o => o.SubTotal).HasPrecision(18, 2);
        builder.Property(o => o.ShippingCost).HasPrecision(18, 2);
        builder.Property(o => o.TaxAmount).HasPrecision(18, 2);
        builder.Property(o => o.TotalAmount).HasPrecision(18, 2);
        builder.Property(o => o.PaymentIntentId).HasMaxLength(200);
        builder.Property(o => o.TrackingNumber).HasMaxLength(100);
        builder.Property(o => o.Notes).HasMaxLength(1000);

        // Owned value object: Address
        builder.OwnsOne(o => o.ShippingAddress, a =>
        {
            a.Property(x => x.Street).HasMaxLength(200).HasColumnName("ShipStreet");
            a.Property(x => x.City).HasMaxLength(100).HasColumnName("ShipCity");
            a.Property(x => x.State).HasMaxLength(100).HasColumnName("ShipState");
            a.Property(x => x.ZipCode).HasMaxLength(20).HasColumnName("ShipZipCode");
            a.Property(x => x.Country).HasMaxLength(100).HasColumnName("ShipCountry");
        });

        builder.HasOne(o => o.User).WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId).OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.Items).WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.ProductName).HasMaxLength(200).IsRequired();
        builder.Property(i => i.VariantDescription).HasMaxLength(100);
        builder.Property(i => i.ProductImageUrl).HasMaxLength(500);
        builder.Property(i => i.UnitPrice).HasPrecision(18, 2).IsRequired();
        builder.Ignore(i => i.SubTotal);

        builder.HasOne(i => i.Product).WithMany()
            .HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.Variant).WithMany()
            .HasForeignKey(i => i.VariantId).OnDelete(DeleteBehavior.SetNull);
    }
}
