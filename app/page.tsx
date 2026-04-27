import type { Metadata } from "next";
import { CategoryStrip } from "@/features/products/components/category-strip";
import { FeaturedProducts } from "@/features/products/components/featured-products";
import { HeroSection } from "@/features/products/components/hero-section";
import { Promotions } from "@/features/products/components/promotions";

export const metadata: Metadata = {
  title: "Premium T-Shirt Store",
  description: "Shop premium essentials, performance tees, graphics, oversized fits, and limited capsule drops."
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryStrip />
      <Promotions />
    </>
  );
}
