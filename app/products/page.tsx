import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/features/products/components/product-skeleton";
import { ProductsCatalog } from "@/features/products/components/products-catalog";

export const metadata: Metadata = {
  title: "Shop T-Shirts",
  description: "Browse premium t-shirts with filtering, sorting, search, and infinite loading."
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <section className="container-shell py-10">
          <ProductGridSkeleton count={8} />
        </section>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
