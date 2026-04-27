"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, PackageCheck, Ruler, Truck } from "lucide-react";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { RatingStars } from "@/components/ui/rating-stars";
import { ProductGallery } from "@/features/products/components/product-gallery";
import { ProductReviews } from "@/features/products/components/product-reviews";
import { useWishlistStore } from "@/store/wishlist.store";
import type { Product, ProductSize } from "@/types/product";
import { cn } from "@/utils/cn";

export function ProductDetailsView({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(product.sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name ?? "");
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlisted = useWishlistStore((state) => state.has(product.id));

  return (
    <>
      <section className="container-shell section-space grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images} productName={product.name} />
        <div className="surface rounded-lg p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap gap-2">
            {product.isNew ? <Badge tone="warning">New arrival</Badge> : null}
            {product.originalPrice ? <Badge tone="danger">Limited sale</Badge> : null}
            <Badge tone="info">{product.category}</Badge>
          </div>
          <h1 className="mt-4 headline-h1">{product.name}</h1>
          <p className="mt-4 text-body text-muted">{product.longDescription}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Price value={product.price} originalValue={product.originalPrice} />
            <span className="h-4 w-px bg-ink-200 dark:bg-white/15" />
            <RatingStars rating={product.rating} />
            <span className="text-sm text-muted">{product.reviewCount} reviews</span>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-100">Color</h2>
                <span className="text-sm font-semibold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    className={cn(
                      "h-10 w-10 rounded-full border-2",
                      selectedColor === color.name ? "border-ink-900 dark:border-citrus" : "border-transparent"
                    )}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.name)}
                    aria-label={`Select ${color.name}`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-500 dark:text-ink-100">Size</h2>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-clay">
                  <Ruler className="h-4 w-4" />
                  Size guide
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    className={cn(
                      "focus-ring h-11 rounded-md border text-sm font-semibold transition",
                      selectedSize === size
                        ? "border-ink-900 bg-ink-900 text-white dark:border-citrus dark:bg-citrus dark:text-ink-900"
                        : "border-ink-200 bg-white hover:bg-ink-50 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                    )}
                    onClick={() => setSelectedSize(size)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted">{product.inventory < 8 ? `Low stock: only ${product.inventory} left` : `${product.inventory} pieces in stock`}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <AddToCartButton product={product} selectedSize={selectedSize} selectedColor={selectedColor} />
              <Button variant="outline" size="lg" onClick={() => toggleWishlist(product.id)}>
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-clay text-clay")} />
                {isWishlisted ? "Saved" : "Save"}
              </Button>
            </div>

            <div className="grid gap-3 border-t border-ink-200 pt-5 text-sm dark:border-white/15">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-moss" />
                Free shipping on orders over $120
              </div>
              <div className="flex items-center gap-3">
                <PackageCheck className="h-5 w-5 text-ocean" />
                {product.inventory} pieces in stock
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductReviews product={product} />
    </>
  );
}
