export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ProductCategory = "essentials" | "performance" | "graphic" | "oversized" | "limited";

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export type ProductColor = {
  name: string;
  value: string;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
};

export type ProductVariant = {
  id: string;
  size: string;
  color: string;
  priceAdjustment: number | null;
  stockQuantity: number;
  sku: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  sizes: ProductSize[];
  colors: ProductColor[];
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  inventory: number;
  featured: boolean;
  isNew: boolean;
  tags: string[];
  material: string;
  fit: string;
  createdAt: string;
  variants?: ProductVariant[];
};

export type ProductFilters = {
  search?: string;
  category?: ProductCategory | "all";
  size?: ProductSize | "all";
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
};
