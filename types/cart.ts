import type { ProductSize } from "./product";

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: ProductSize;
  color: string;
  quantity: number;
  stock: number;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
};

// Backend DTOs
export type CartItemResponse = {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantDescription: string | null;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  imageUrl: string | null;
};

export type CartResponse = {
  id: string;
  items: CartItemResponse[];
  totalAmount: number;
  totalItems: number;
};
