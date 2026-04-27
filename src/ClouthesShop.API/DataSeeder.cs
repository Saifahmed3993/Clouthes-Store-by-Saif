using ClouthesShop.Domain.Entities;
using ClouthesShop.Domain.Enums;
using ClouthesShop.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ClouthesShop.API;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext db, IServiceProvider services)
    {
        if (await db.Categories.AnyAsync()) return;

        // ── Categories ────────────────────────────────────────────────────────
        var basics = Category.Create("Basics", "Essential everyday tees", "https://placehold.co/400x300/1a1a2e/ffffff?text=Basics");
        var graphic = Category.Create("Graphic Tees", "Bold graphic designs", "https://placehold.co/400x300/16213e/ffffff?text=Graphic");
        var premium = Category.Create("Premium", "Long-lasting premium cotton", "https://placehold.co/400x300/0f3460/ffffff?text=Premium");
        var sports = Category.Create("Sports", "Performance athletic wear", "https://placehold.co/400x300/533483/ffffff?text=Sports");

        await db.Categories.AddRangeAsync(basics, graphic, premium, sports);
        await db.SaveChangesAsync();

        // ── Products ──────────────────────────────────────────────────────────
        var products = new[]
        {
            CreateProduct("Classic White Tee", "Premium 100% combed cotton crew-neck t-shirt. Ultra-soft, breathable fabric perfect for everyday wear.", 24.99m, basics.Id, 150,
                new[] { ("https://placehold.co/800x1000/f5f5f5/333333?text=White+Tee", true), ("https://placehold.co/800x1000/e0e0e0/333333?text=White+Tee+Side", false) },
                new[] { ("S","White"), ("M","White"), ("L","White"), ("XL","White"), ("S","Black"), ("M","Black"), ("L","Black"), ("XL","Black") }),
            CreateProduct("Midnight Black Essential", "Sleek classic black tee with reinforced stitching and a tailored fit for a modern silhouette.", 27.99m, basics.Id, 200,
                new[] { ("https://placehold.co/800x1000/1a1a1a/ffffff?text=Black+Tee", true) },
                new[] { ("S","Black"), ("M","Black"), ("L","Black"), ("XL","Black"), ("XXL","Black") }),
            CreateProduct("Urban Graffiti Tee", "Limited edition graphic tee featuring original street-art inspired artwork. Unisex fit.", 39.99m, graphic.Id, 75,
                new[] { ("https://placehold.co/800x1000/2c2c54/ffffff?text=Graffiti+Tee", true), ("https://placehold.co/800x1000/474787/ffffff?text=Graffiti+Back", false) },
                new[] { ("S","Purple"), ("M","Purple"), ("L","Purple"), ("XL","Purple") }),
            CreateProduct("Retro Wave Graphic", "80s retro synthwave design on 230gsm heavyweight cotton. Stays vibrant wash after wash.", 34.99m, graphic.Id, 120,
                new[] { ("https://placehold.co/800x1000/0d0d0d/00fff5?text=Retro+Wave", true) },
                new[] { ("S","Navy"), ("M","Navy"), ("L","Navy"), ("XL","Navy"), ("S","Black"), ("M","Black") }),
            CreateProduct("Supima Luxury Tee", "Crafted from 100% Supima cotton — the finest American-grown cotton. Incredibly soft, minimal shrinkage.", 59.99m, premium.Id, 60,
                new[] { ("https://placehold.co/800x1000/f8f0e3/333333?text=Luxury+Tee", true) },
                new[] { ("S","Cream"), ("M","Cream"), ("L","Cream"), ("XL","Cream"), ("S","Sage"), ("M","Sage"), ("L","Sage") }),
            CreateProduct("Athletic Performance Tee", "Moisture-wicking, quick-dry polyester blend with a 4-way stretch for maximum movement.", 44.99m, sports.Id, 180,
                new[] { ("https://placehold.co/800x1000/1a472a/ffffff?text=Sports+Tee", true), ("https://placehold.co/800x1000/2d6a4f/ffffff?text=Sports+Back", false) },
                new[] { ("S","Forest Green"), ("M","Forest Green"), ("L","Forest Green"), ("XL","Forest Green"), ("S","Royal Blue"), ("M","Royal Blue") }),
        };

        await db.Products.AddRangeAsync(products);
        await db.SaveChangesAsync();

        // ── Admin User ────────────────────────────────────────────────────────
        if (!await db.Users.AnyAsync())
        {
            var admin = User.Create("Admin", "ClouthesShop", "admin@clouthesshop.com",
                BCrypt.Net.BCrypt.HashPassword("Admin@123!", 12), UserRole.Admin);
            admin.VerifyEmail();

            var customer = User.Create("John", "Doe", "john@example.com",
                BCrypt.Net.BCrypt.HashPassword("Customer@123!", 12));
            customer.VerifyEmail();

            await db.Users.AddRangeAsync(admin, customer);
            await db.SaveChangesAsync();
        }
    }

    private static Product CreateProduct(
        string name, string description, decimal price, Guid categoryId, int stock,
        (string Url, bool IsPrimary)[] images, (string Size, string Color)[] variants)
    {
        var product = Product.Create(name, description, price, categoryId, stock);
        foreach (var (url, isPrimary) in images) product.AddImage(url, isPrimary);
        decimal? adj = null;
        foreach (var (size, color) in variants)
        {
            adj = size is "XL" or "XXL" ? 2.00m : null;
            product.AddVariant(size, color, adj, (int)(stock / Math.Max(variants.Length, 1)));
        }
        return product;
    }
}
