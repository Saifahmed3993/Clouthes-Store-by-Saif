using ClouthesShop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClouthesShop.Infrastructure.Persistence.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.ToTable("Carts");
        builder.HasKey(c => c.Id);

        builder.HasMany(c => c.Items).WithOne(i => i.Cart)
            .HasForeignKey(i => i.CartId).OnDelete(DeleteBehavior.Cascade);

        builder.Ignore(c => c.TotalAmount);
        builder.Ignore(c => c.TotalItems);
    }
}

public class CartItemConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.ToTable("CartItems");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.ProductName).HasMaxLength(200).IsRequired();
        builder.Property(i => i.UnitPrice).HasPrecision(18, 2).IsRequired();
        builder.Property(i => i.ImageUrl).HasMaxLength(500);
        builder.Ignore(i => i.SubTotal);

        builder.HasOne(i => i.Product).WithMany()
            .HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(i => i.Variant).WithMany()
            .HasForeignKey(i => i.VariantId).OnDelete(DeleteBehavior.SetNull);
    }
}
