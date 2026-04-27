import { apiClient } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { PaginatedResponse } from "@/types/api";
import type { Product, ProductFilters, ProductReview } from "@/types/product";
import { products } from "@/utils/seed-data";

const mocksEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false";
const DEFAULT_PAGE_SIZE = 8;

async function mockDelay() {
  await new Promise((resolve) => globalThis.setTimeout(resolve, 300));
}

function applyFilters(source: Product[], filters: ProductFilters = {}) {
  let result = [...source];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter((product) =>
      [product.name, product.description, product.category, product.tags.join(" ")].join(" ").toLowerCase().includes(search)
    );
  }

  if (filters.category && filters.category !== "all") {
    result = result.filter((product) => product.category === filters.category);
  }

  const selectedSize = filters.size;
  if (selectedSize && selectedSize !== "all") {
    result = result.filter((product) => product.sizes.includes(selectedSize));
  }

  if (typeof filters.minPrice === "number") {
    result = result.filter((product) => product.price >= Number(filters.minPrice));
  }

  if (typeof filters.maxPrice === "number") {
    result = result.filter((product) => product.price <= Number(filters.maxPrice));
  }

  switch (filters.sort) {
    case "newest":
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  return result;
}

export const productService = {
  async getProducts({
    cursor,
    pageSize = DEFAULT_PAGE_SIZE,
    ...filters
  }: ProductFilters & { cursor?: string; pageSize?: number }): Promise<PaginatedResponse<Product>> {
    if (mocksEnabled) {
      await mockDelay();
      const filtered = applyFilters(products, filters);
      const page = cursor ? Number(cursor) : 1;
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

      return {
        items,
        page,
        pageSize,
        totalItems: filtered.length,
        totalPages,
        nextCursor: page < totalPages ? String(page + 1) : null
      };
    }

    const response = await apiClient.get<PaginatedResponse<Product>>(endpoints.products.list, {
      params: { cursor, pageSize, ...filters }
    });
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    if (mocksEnabled) {
      await mockDelay();
      return products.filter((product) => product.featured).slice(0, 4);
    }

    const response = await apiClient.get<PaginatedResponse<Product>>(endpoints.products.list, {
      params: { featured: true, pageSize: 4 }
    });
    return response.data.items;
  },

  async getProduct(slug: string): Promise<Product> {
    if (mocksEnabled) {
      await mockDelay();
      const product = products.find((item) => item.slug === slug);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    }

    const response = await apiClient.get<Product>(endpoints.products.detail(slug));
    return response.data;
  },

  async getWishlistProducts(productIds: string[]): Promise<Product[]> {
    if (mocksEnabled) {
      await mockDelay();
      return products.filter((product) => productIds.includes(product.id));
    }

    const response = await apiClient.get<Product[]>(endpoints.products.list, {
      params: { ids: productIds.join(",") }
    });
    return response.data;
  },

  async addReview(productId: string, review: Omit<ProductReview, "id" | "createdAt">): Promise<ProductReview> {
    if (mocksEnabled) {
      await mockDelay();
      const createdReview = {
        ...review,
        id: `rev-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const product = products.find((item) => item.id === productId);
      if (product) {
        product.reviews = [createdReview, ...product.reviews];
        product.reviewCount += 1;
        product.rating = Number(
          ((product.rating * (product.reviewCount - 1) + createdReview.rating) / product.reviewCount).toFixed(1)
        );
      }
      return createdReview;
    }

    const response = await apiClient.post<ProductReview>(endpoints.products.reviews(productId), review);
    return response.data;
  }
};
