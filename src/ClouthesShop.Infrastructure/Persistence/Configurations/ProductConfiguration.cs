using ClouthesShop.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ClouthesShop.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Name).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Slug).HasMaxLength(220).IsRequired();
        builder.HasIndex(p => p.Slug).IsUnique();
        builder.Property(p => p.Description).HasMaxLength(4000).IsRequired();
        builder.Property(p => p.BasePrice).HasPrecision(18, 2).IsRequired();
        builder.Property(p => p.AverageRating).HasPrecision(3, 2);

        builder.HasOne(p => p.Category).WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId).OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(p => p.Variants).WithOne(v => v.Product)
            .HasForeignKey(v => v.ProductId).OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Images).WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId).OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(p => p.Reviews).WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("ProductVariants");
        builder.HasKey(v => v.Id);
        builder.Property(v => v.Size).HasMaxLength(10).IsRequired();
        builder.Property(v => v.Color).HasMaxLength(50).IsRequired();
        builder.Property(v => v.PriceAdjustment).HasPrecision(18, 2);
        builder.Property(v => v.Sku).HasMaxLength(50);
        builder.HasIndex(v => v.Sku).IsUnique().HasFilter("[Sku] IS NOT NULL");
    }
}

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.ToTable("ProductImages");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.Url).HasMaxLength(500).IsRequired();
    }
}
