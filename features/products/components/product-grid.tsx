import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/features/products/components/product-card";
import type { Product } from "@/types/product";
import { Shirt } from "lucide-react";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={Shirt}
        title="No products found"
        message="Try adjusting the search, size, category, or price range."
        actionHref="/products"
        actionLabel="Reset catalog"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 2} />
      ))}
    </div>
  );
}
