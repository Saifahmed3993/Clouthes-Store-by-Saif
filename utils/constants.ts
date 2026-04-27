import type { ProductCategory, ProductSize, ProductSort } from "@/types/product";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Clouthes";

export const SESSION_COOKIE_NAMES = ["clouthes.session", "clouthes.refresh"];

export const productSizes: ProductSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

export const productCategories: Array<{ label: string; value: ProductCategory | "all"; description: string }> = [
  { label: "All", value: "all", description: "Every tee in the collection" },
  { label: "Essentials", value: "essentials", description: "Clean staples for daily rotation" },
  { label: "Performance", value: "performance", description: "Breathable layers for motion" },
  { label: "Graphic", value: "graphic", description: "Art-led prints and capsule graphics" },
  { label: "Oversized", value: "oversized", description: "Relaxed silhouettes with structure" },
  { label: "Limited", value: "limited", description: "Short-run pieces and collaborations" }
];

export const productSortOptions: Array<{ label: string; value: ProductSort }> = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" }
];

export const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/orders", label: "Orders" },
  { href: "/admin", label: "Admin" }
];
