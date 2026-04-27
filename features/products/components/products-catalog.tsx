"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { useDebounce } from "@/hooks/use-debounce";
import { ProductFilters } from "@/features/products/components/product-filters";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductGridSkeleton } from "@/features/products/components/product-skeleton";
import { useInfiniteProducts } from "@/features/products/hooks/use-products";
import type { ProductFilters as ProductFiltersType } from "@/types/product";
import { productCategories, productSizes, productSortOptions } from "@/utils/constants";

const defaultFilters: ProductFiltersType = {
  category: "all",
  size: "all",
  sort: "featured"
};

export function ProductsCatalog() {
  const searchParams = useSearchParams();
  const initialFilters = useMemo<ProductFiltersType>(() => {
    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const sort = searchParams.get("sort");
    return {
      ...defaultFilters,
      search: searchParams.get("search") ?? undefined,
      category: productCategories.some((item) => item.value === category) ? (category as ProductFiltersType["category"]) : "all",
      size: productSizes.includes(size as never) ? (size as ProductFiltersType["size"]) : "all",
      sort: productSortOptions.some((item) => item.value === sort) ? (sort as ProductFiltersType["sort"]) : "featured"
    };
  }, [searchParams]);
  const [filters, setFilters] = useState<ProductFiltersType>(initialFilters);
  const debouncedFilters = useDebounce(filters, 350);
  const query = useInfiniteProducts(debouncedFilters);

  const products = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const totalItems = query.data?.pages[0]?.totalItems ?? 0;

  return (
    <div className="container-shell section-space">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Shop</p>
          <h1 className="mt-2 headline-h1">T-shirts for every rotation.</h1>
        </div>
        <p className="text-sm font-medium text-muted">{totalItems} styles available</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
        <ProductFilters filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
        <div className="space-y-6">
          {query.isLoading ? <ProductGridSkeleton count={8} /> : null}
          {query.isError ? (
            <ErrorState
              title="Catalog could not load"
              message="The product service did not respond. Try again in a moment."
              actionLabel="Retry"
              onAction={() => query.refetch()}
            />
          ) : null}
          {!query.isLoading && !query.isError ? <ProductGrid products={products} /> : null}
          {query.hasNextPage ? (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => query.fetchNextPage()} disabled={query.isFetchingNextPage}>
                {query.isFetchingNextPage ? "Loading more" : "Load more"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
