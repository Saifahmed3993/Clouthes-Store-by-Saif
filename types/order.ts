import type { CartItem } from "./cart";

export type Address = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type PaymentMethod = "card" | "cash-on-delivery" | "paypal";

export type CheckoutPayload = {
  address: Address;
  paymentMethod: PaymentMethod;
  saveAddress: boolean;
};

export type OrderStatus = "placed" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  eta: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
};
