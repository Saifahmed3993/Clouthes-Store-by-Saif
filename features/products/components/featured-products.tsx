"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductGridSkeleton } from "@/features/products/components/product-skeleton";
import { useFeaturedProducts } from "@/features/products/hooks/use-products";

export function FeaturedProducts() {
  const query = useFeaturedProducts();

  return (
    <section className="container-shell section-space">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Featured</p>
          <h2 className="mt-2 headline-h2">The current rotation.</h2>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/products">
            Shop all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      {query.isLoading ? <ProductGridSkeleton count={4} /> : null}
      {query.isError ? (
        <ErrorState
          title="Featured products could not load"
          message="The product feed is temporarily unavailable."
          actionLabel="Retry"
          onAction={() => query.refetch()}
        />
      ) : null}
      {query.data ? <ProductGrid products={query.data} /> : null}
    </section>
  );
}
