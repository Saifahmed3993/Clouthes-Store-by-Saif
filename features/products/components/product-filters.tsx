"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/utils/cn";
import type { ProductFilters } from "@/types/product";
import { productCategories, productSizes, productSortOptions } from "@/utils/constants";

type ProductFiltersProps = {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onReset: () => void;
};

export function ProductFilters({ filters, onChange, onReset }: ProductFiltersProps) {
  const update = (next: Partial<ProductFilters>) => onChange({ ...filters, ...next });

  const appliedFilters = [
    filters.search && `Search: ${filters.search}`,
    filters.category && filters.category !== "all" ? `Category: ${filters.category}` : null,
    filters.size && filters.size !== "all" ? `Size: ${filters.size}` : null,
    filters.minPrice ? `Min: $${filters.minPrice}` : null,
    filters.maxPrice ? `Max: $${filters.maxPrice}` : null,
    filters.sort && filters.sort !== "featured" ? `Sort: ${filters.sort}` : null
  ].filter(Boolean);

  return (
    <aside className="surface space-y-6 rounded-lg p-5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <Input
        label="Search"
        placeholder="Search tees"
        value={filters.search ?? ""}
        onChange={(event) => update({ search: event.target.value })}
      />

      <Select
        label="Category"
        value={filters.category ?? "all"}
        onChange={(event) => update({ category: event.target.value as ProductFilters["category"] })}
        options={productCategories.map((category) => ({ label: category.label, value: category.value }))}
      />

      <Select
        label="Size"
        value={filters.size ?? "all"}
        onChange={(event) => update({ size: event.target.value as ProductFilters["size"] })}
        options={[{ label: "All sizes", value: "all" }, ...productSizes.map((size) => ({ label: size, value: size }))]}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Min price"
          type="number"
          min={0}
          value={filters.minPrice ?? ""}
          onChange={(event) => update({ minPrice: event.target.value ? Number(event.target.value) : undefined })}
        />
        <Input
          label="Max price"
          type="number"
          min={0}
          value={filters.maxPrice ?? ""}
          onChange={(event) => update({ maxPrice: event.target.value ? Number(event.target.value) : undefined })}
        />
      </div>

      <Select
        label="Sort"
        value={filters.sort ?? "featured"}
        onChange={(event) => update({ sort: event.target.value as ProductFilters["sort"] })}
        options={productSortOptions}
      />

      {appliedFilters.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-t border-ink-200/80 pt-4 dark:border-white/15">
          {appliedFilters.map((filter) => (
            <span key={filter} className={cn("rounded-full bg-ink-200/80 px-2.5 py-1 text-xs font-medium dark:bg-white/15")}>
              {filter}
            </span>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
