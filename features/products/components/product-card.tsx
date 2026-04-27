"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { RatingStars } from "@/components/ui/rating-stars";
import { useWishlistStore } from "@/store/wishlist.store";
import type { Product } from "@/types/product";
import { cn } from "@/utils/cn";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const isWishlisted = useWishlistStore((state) => state.has(product.id));
  const isOutOfStock = product.inventory < 1;
  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative"
    >
      <div className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink-100 dark:bg-white/10">
          <Link href={`/products/${product.slug}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
          <Image
            src={product.images[0].src}
            alt={product.images[0].alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover pointer-events-none transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 pointer-events-none" />
          <div className="absolute left-3 top-3 flex gap-2 z-20 pointer-events-none">
            {product.isNew ? <Badge tone="warning">New</Badge> : null}
            {product.originalPrice ? <Badge tone="danger">{discountPercent}% off</Badge> : null}
          </div>
          {isOutOfStock ? <Badge className="absolute right-3 top-3 z-20 pointer-events-none" tone="danger">Out of stock</Badge> : null}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 translate-y-4 opacity-0 transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <Button asChild className="w-full" size="sm" disabled={isOutOfStock}>
              <Link href={`/products/${product.slug}`}>
                <ShoppingBag className="h-4 w-4" />
                {isOutOfStock ? "Unavailable" : "Quick add"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`} className="font-display text-lg font-semibold hover:text-clay">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <RatingStars rating={product.rating} />
            <span className="text-muted">({product.reviewCount})</span>
          </div>
        </div>
        <Button
          variant="secondary"
          size="icon"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-clay text-clay")} />
        </Button>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <Price value={product.price} originalValue={product.originalPrice} />
        <Button asChild variant="ghost" size="sm">
          <Link href={`/products/${product.slug}`}>
            <ShoppingBag className="h-4 w-4" />
            View
          </Link>
        </Button>
      </div>
    </motion.article>
  );
}
