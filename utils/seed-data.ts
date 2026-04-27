import type { AnalyticsPoint, AdminMetric } from "@/types/admin";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "tee-001",
    slug: "aero-knit-tee",
    name: "Aero Knit Tee",
    description: "A breathable cotton-modal tee with a refined athletic drape.",
    longDescription:
      "Built for long days and clean silhouettes, the Aero Knit Tee uses a soft cotton-modal jersey that stays structured without feeling heavy. The neckline is reinforced and the body is pre-shrunk for dependable fit.",
    price: 48,
    originalPrice: 68,
    category: "performance",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Bone", value: "#f2efe5" },
      { name: "Ink", value: "#1f2428" },
      { name: "Ocean", value: "#205b73" }
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85",
        alt: "White premium t-shirt front view"
      },
      {
        src: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=1100&q=85",
        alt: "Folded neutral t-shirt fabric detail"
      }
    ],
    rating: 4.8,
    reviewCount: 184,
    reviews: [
      {
        id: "rev-001",
        author: "Maya R.",
        rating: 5,
        title: "Sharp enough for work",
        content: "The fabric hangs cleanly and still feels soft after a full day.",
        createdAt: "2026-03-15"
      },
      {
        id: "rev-002",
        author: "Daniel K.",
        rating: 4,
        title: "Great travel shirt",
        content: "Packed well, recovered quickly, and looked fresh after a flight.",
        createdAt: "2026-02-22"
      }
    ],
    inventory: 84,
    featured: true,
    isNew: false,
    tags: ["breathable", "travel", "modal"],
    material: "58% cotton, 37% modal, 5% elastane",
    fit: "Standard athletic fit",
    createdAt: "2026-01-28"
  },
  {
    id: "tee-002",
    slug: "studio-heavyweight-tee",
    name: "Studio Heavyweight Tee",
    description: "A dense, structured tee with a premium hand feel.",
    longDescription:
      "Cut from heavyweight combed cotton, this tee gives a clean box shape without stiffness. It is garment washed for depth and finished with durable shoulder taping.",
    price: 72,
    category: "essentials",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Washed Black", value: "#20201d" },
      { name: "Stone", value: "#c7bca7" },
      { name: "Moss", value: "#5e7156" }
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1100&q=85",
        alt: "Heavyweight black t-shirt"
      },
      {
        src: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1100&q=85",
        alt: "Neutral t-shirt studio styling"
      }
    ],
    rating: 4.7,
    reviewCount: 96,
    reviews: [
      {
        id: "rev-003",
        author: "Lena S.",
        rating: 5,
        title: "The neckline stays perfect",
        content: "Feels substantial but not hot. The shape is exactly what I wanted.",
        createdAt: "2026-01-19"
      }
    ],
    inventory: 52,
    featured: true,
    isNew: true,
    tags: ["heavyweight", "structured", "cotton"],
    material: "100% combed organic cotton",
    fit: "Relaxed box fit",
    createdAt: "2026-03-06"
  },
  {
    id: "tee-003",
    slug: "linework-graphic-tee",
    name: "Linework Graphic Tee",
    description: "Soft jersey with a minimal front graphic and back print.",
    longDescription:
      "A gallery-inspired graphic tee printed with water-based inks for a worn-in feel from the first wear. The body keeps a balanced fit that layers cleanly.",
    price: 54,
    category: "graphic",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Natural", value: "#f3ead8" },
      { name: "Clay", value: "#9e5d47" }
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?auto=format&fit=crop&w=1100&q=85",
        alt: "Graphic t-shirt on hanger"
      },
      {
        src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1100&q=85",
        alt: "Printed t-shirt close view"
      }
    ],
    rating: 4.5,
    reviewCount: 71,
    reviews: [
      {
        id: "rev-004",
        author: "Omar H.",
        rating: 5,
        title: "Print feels premium",
        content: "No plastic feel and the shirt got softer after washing.",
        createdAt: "2026-03-27"
      }
    ],
    inventory: 28,
    featured: true,
    isNew: true,
    tags: ["graphic", "water-based ink", "capsule"],
    material: "100% ring-spun cotton",
    fit: "Standard fit",
    createdAt: "2026-03-22"
  },
  {
    id: "tee-004",
    slug: "weekend-oversized-tee",
    name: "Weekend Oversized Tee",
    description: "Dropped shoulder tee with a relaxed but intentional shape.",
    longDescription:
      "The Weekend Oversized Tee is made with garment-dyed cotton jersey and a wide sleeve opening. It gives an easy off-duty profile without swallowing the body.",
    price: 64,
    category: "oversized",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Mineral", value: "#89918a" },
      { name: "Washed Navy", value: "#2e3d52" },
      { name: "Blush", value: "#d9908c" }
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1100&q=85",
        alt: "Relaxed oversized tee styled on model"
      },
      {
        src: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&w=1100&q=85",
        alt: "Oversized t-shirt streetwear styling"
      }
    ],
    rating: 4.6,
    reviewCount: 139,
    reviews: [
      {
        id: "rev-005",
        author: "Nora E.",
        rating: 4,
        title: "Easy shape",
        content: "Boxy in the right way and the sleeve length is excellent.",
        createdAt: "2026-04-03"
      }
    ],
    inventory: 63,
    featured: false,
    isNew: false,
    tags: ["oversized", "garment dyed", "streetwear"],
    material: "100% organic cotton jersey",
    fit: "Oversized dropped shoulder",
    createdAt: "2026-02-12"
  },
  {
    id: "tee-005",
    slug: "carbon-run-tee",
    name: "Carbon Run Tee",
    description: "Lightweight training tee with moisture control and quick dry finish.",
    longDescription:
      "Designed for training days, the Carbon Run Tee uses a recycled performance knit that moves sweat away from the skin and resists cling during high-output sessions.",
    price: 58,
    category: "performance",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Graphite", value: "#34383d" },
      { name: "Citrus", value: "#d7b548" }
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1100&q=85",
        alt: "Athletic t-shirt in motion"
      },
      {
        src: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1100&q=85",
        alt: "Performance apparel detail"
      }
    ],
    rating: 4.4,
    reviewCount: 54,
    reviews: [
      {
        id: "rev-006",
        author: "Chris P.",
        rating: 4,
        title: "Great for training",
        content: "Light, clean fit, and dries faster than my older workout shirts.",
        createdAt: "2026-03-11"
      }
    ],
    inventory: 76,
    featured: false,
    isNew: false,
    tags: ["training", "quick dry", "recycled"],
    material: "86% recycled polyester, 14% elastane",
    fit: "Slim performance fit",
    createdAt: "2026-01-05"
  },
  {
    id: "tee-006",
    slug: "atelier-pocket-tee",
    name: "Atelier Pocket Tee",
    description: "A premium pocket tee with subtle contrast stitching.",
    longDescription:
      "The Atelier Pocket Tee borrows from workwear construction with a clean chest pocket, durable stitching, and a garment-washed surface that softens every wear.",
    price: 62,
    originalPrice: 78,
    category: "limited",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Ecru", value: "#ebe0cd" },
      { name: "Olive", value: "#62664c" }
    ],
    images: [
      {
        src: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=1100&q=85",
        alt: "Premium pocket t-shirt"
      },
      {
        src: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1100&q=85",
        alt: "Casual premium tee styling"
      }
    ],
    rating: 4.9,
    reviewCount: 41,
    reviews: [
      {
        id: "rev-007",
        author: "Ari J.",
        rating: 5,
        title: "Small details matter",
        content: "The stitching and fabric make this feel more elevated than a normal tee.",
        createdAt: "2026-02-08"
      }
    ],
    inventory: 17,
    featured: true,
    isNew: false,
    tags: ["limited", "pocket", "workwear"],
    material: "100% organic cotton",
    fit: "Standard fit",
    createdAt: "2026-02-02"
  }
];

export const analyticsSeries: AnalyticsPoint[] = [
  { label: "Jan", revenue: 42400, orders: 540 },
  { label: "Feb", revenue: 48900, orders: 618 },
  { label: "Mar", revenue: 57300, orders: 702 },
  { label: "Apr", revenue: 64100, orders: 780 },
  { label: "May", revenue: 71400, orders: 826 },
  { label: "Jun", revenue: 83500, orders: 958 }
];

export const adminMetrics: AdminMetric[] = [
  { label: "Revenue", value: "$83.5K", delta: "+18.1%", trend: "up" },
  { label: "Orders", value: "958", delta: "+12.7%", trend: "up" },
  { label: "Conversion", value: "4.8%", delta: "+0.6%", trend: "up" },
  { label: "Returns", value: "2.1%", delta: "-0.4%", trend: "down" }
];

export const orders: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "CL-1001",
    status: "shipped",
    createdAt: "2026-04-18",
    eta: "2026-04-29",
    trackingNumber: "DHL-90488218",
    items: [
      {
        id: "tee-001-M-Bone",
        productId: "tee-001",
        slug: "aero-knit-tee",
        name: "Aero Knit Tee",
        price: 48,
        image: products[0].images[0].src,
        size: "M",
        color: "Bone",
        quantity: 2,
        stock: 84
      }
    ],
    subtotal: 96,
    shipping: 0,
    tax: 8,
    total: 104
  },
  {
    id: "ord-1002",
    orderNumber: "CL-1002",
    status: "delivered",
    createdAt: "2026-03-30",
    eta: "2026-04-05",
    trackingNumber: "UPS-84710277",
    items: [
      {
        id: "tee-003-L-Natural",
        productId: "tee-003",
        slug: "linework-graphic-tee",
        name: "Linework Graphic Tee",
        price: 54,
        image: products[2].images[0].src,
        size: "L",
        color: "Natural",
        quantity: 1,
        stock: 28
      }
    ],
    subtotal: 54,
    shipping: 8,
    tax: 5,
    total: 67
  }
];
