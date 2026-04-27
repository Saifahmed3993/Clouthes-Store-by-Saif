export const endpoints = {
  auth: {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    refresh: "/v1/auth/refresh-token",
    logout: "/v1/auth/logout",
    me: "/v1/auth/me"
  },
  products: {
    list: "/v1/products",
    detail: (id: string) => `/v1/products/${id}`,
    bySlug: (slug: string) => `/v1/products/slug/${slug}`,
    reviews: (productId: string) => `/v1/reviews/product/${productId}`
  },
  cart: {
    root: "/v1/cart",
    items: "/v1/cart/items",
    item: (id: string) => `/v1/cart/items/${id}`,
    checkout: "/checkout"
  },
  orders: {
    list: "/v1/orders",
    root: "/v1/orders",
    my: "/v1/orders/my",
    detail: (id: string) => `/v1/orders/${id}`,
    cancel: (id: string) => `/v1/orders/${id}/cancel`,
    status: (id: string) => `/v1/orders/${id}/status`
  },
  payments: {
    intent: "/v1/payments/intent",
    webhook: "/v1/payments/webhook"
  },
  reviews: {
    forProduct: (productId: string) => `/v1/reviews/product/${productId}`,
    root: "/v1/reviews"
  },
  admin: {
    products: "/v1/products",
    orders: "/v1/orders",
    orderStatus: (id: string) => `/v1/orders/${id}/status`,
    analytics: "/admin/analytics"
  }
};
