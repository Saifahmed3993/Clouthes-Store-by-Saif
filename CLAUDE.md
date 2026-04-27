# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Clouthes** is an enterprise-grade Next.js 16 App Router storefront for a premium t-shirt commerce platform. The frontend is a TypeScript-based React 19 application with server and client components, designed to integrate with an ASP.NET Core backend API.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.7 (strict mode)
- **React**: React 19 with Server and Client Components
- **Styling**: Tailwind CSS 3.4 with custom theme (dark mode support)
- **State Management**: Zustand 5 (client-side local state with localStorage persistence)
- **Data Fetching**: TanStack Query 5.66 (React Query) for server state + Axios
- **Forms**: React Hook Form 7.54 + Zod 3.24 (validation)
- **UI & Animation**: Lucide React (icons), Framer Motion (animations), Sonner (toasts), Recharts (analytics)
- **Testing**: Jest 29 + React Testing Library 16
- **Linting**: ESLint 10 (Next.js + TypeScript configs)

## Key Architecture Patterns

### Authentication & Authorization

- **Token Management**: JWT-based with access tokens and refresh tokens (secure HttpOnly cookies from backend)
- **Auth Store**: Zustand store (store/auth.store.ts) persists user and auth status to localStorage
- **Middleware**: middleware.ts protects routes (/checkout, /orders, /admin, /wishlist) and auth routes (/login, /register)
- **API Integration**: services/api-client.ts automatically:
  - Includes Bearer token in Authorization headers
  - Retries once on 401 responses by calling /auth/refresh
  - Clears tokens on persistent auth failure
- **Mock Support**: NEXT_PUBLIC_ENABLE_MOCKS=true enables offline development without backend

### Data Fetching Pattern

- **Services Layer**: Each feature has a services/*.service.ts file (e.g., features/products/services/products.service.ts)
- **Query Hooks**: Custom hooks in features/*/hooks/*.ts (e.g., use-products.ts) use TanStack Query for:
  - Caching and automatic refetching
  - Pessimistic/optimistic updates
  - Query key factories for cache invalidation
- **Mock Data**: Services check NEXT_PUBLIC_ENABLE_MOCKS and return seed data from utils/seed-data.ts instead of API calls
- **Error Handling**: Axios interceptor normalizes API errors; services use getApiError() to standardize error shape

### State Management

- **Local/Client State**: Zustand stores in store/:
  - auth.store.ts: user, accessToken, status
  - cart.store.ts: items, with calculated totals (tax, shipping, discount logic)
  - ui.store.ts: mini-cart visibility state
  - All use persist() middleware with localStorage
- **Server State**: TanStack Query caches API responses with stale-while-revalidate patterns

### Component Architecture

- **Pages**: App Router pages in app/ (mostly thin, import feature components)
- **Features**: Feature modules in features/ organized by domain (auth, products, cart, checkout, orders, admin, wishlist)
  - Each has components/, hooks/, services/, and sometimes schemas/
- **Layout Components**: Shared UI in components/layout/ (Header, Footer, MobileNav, ThemeToggle)
- **UI Library**: Generic, unstyled components in components/ui/ (Button, Input, Select, Badge, etc.)
- **Protected Routes**: features/auth/components/protected.tsx wraps content requiring authentication
- **Server-Side Rendering**: Root layout uses Server Components; Providers wrap with client-side context

### Styling & Theming

- **Tailwind CSS**: Custom color palette (ink, clay, moss, ocean, citrus, blush) with light/dark modes
- **CSS-in-JS**: None; all styling via Tailwind utility classes and tailwind.config.ts extensions
- **Dark Mode**: Managed by next-themes with class-based detection
- **Responsive Design**: Mobile-first breakpoints; lg: prefix for desktop-specific layouts

### API Integration

- **Base URL**: NEXT_PUBLIC_API_URL (defaults to https://localhost:7228/api)
- **Endpoints**: services/endpoints.ts defines all routes as constants
- **Contract**:
  - Login/Register return { accessToken, user } with JWT token
  - Refresh token issued as secure HttpOnly clouthes.refresh cookie
  - Access tokens sent as Authorization: Bearer <token>
  - All responses wrapped in { statusCode, message, code?, details? } error format
  - Paginated endpoints use cursor-based pagination with nextCursor field

## Development Commands

\\\ash
npm install              # Install dependencies
npm run dev              # Development server with Turbopack
npm run build            # Build for production
npm start                # Run production server
npm run typecheck        # Type check (no emit)
npm run lint             # Lint with zero warnings
npm run test             # Unit tests
npm run test:watch       # Watch mode tests
\\\

## Environment Configuration

Create .env.local from .env.example:

\\\
NEXT_PUBLIC_API_URL=https://localhost:7228/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_APP_NAME=Clouthes
\\\

- NEXT_PUBLIC_ENABLE_MOCKS: Toggle mock data (true = use seed data, false = call real API)
- NEXT_PUBLIC_API_URL: Backend endpoint (ASP.NET Core service)
- NEXT_PUBLIC_SITE_URL: For OpenGraph and SEO metadata

## Docker

\\\ash
docker-compose up
\\\

Multi-stage build (deps → builder → runner) produces optimized Node.js 22 Alpine image on port 3000.

## File Structure

\\\
app/                          # Next.js App Router pages
├── layout.tsx                # Root layout with font setup and metadata
├── providers.tsx             # Client-side context: Query, Theme, Toast, Loading
├── [page-name]/page.tsx      # Route pages
└── error.tsx, not-found.tsx  # Error boundaries

features/                     # Feature-driven modules
├── auth/
│   ├── components/           # LoginForm, RegisterForm, UserMenu, Protected
│   ├── hooks/                # useLogin, useRegister, useLogout
│   ├── services/             # authService (login, register, logout, me)
│   └── schemas/              # Zod schemas for forms
├── products/
│   ├── components/           # ProductCard, ProductGrid, Filters, Gallery
│   ├── hooks/                # useInfiniteProducts, useFeaturedProducts, etc.
│   └── services/             # productService (CRUD, reviews)
├── cart/, checkout/, orders/, admin/, wishlist/  # Similar structure

components/
├── layout/                   # Header, Footer, MobileNav, ThemeToggle
├── ui/                       # Button, Input, Select, Badge, etc.
└── seo/                      # JsonLd for structured data

store/                        # Zustand stores
├── auth.store.ts             # User session state
├── cart.store.ts             # Shopping cart with totals
└── ui.store.ts               # Mini-cart visibility

services/                     # Core services
├── api-client.ts             # Axios instance with auth interceptors
├── query-client.ts           # TanStack Query client configuration
├── token-manager.ts          # Access token storage (in-memory or custom)
└── endpoints.ts              # API endpoint constants

hooks/                        # Shared custom hooks
├── use-debounce.ts
└── use-mounted.ts

utils/
├── constants.ts              # App constants, product categories, nav items
├── cn.ts                     # clsx wrapper for className merging
├── format.ts                 # Price, date formatting
└── seed-data.ts              # Mock product data

types/                        # TypeScript interfaces
├── auth.ts                   # User, AuthResponse, Payloads
├── product.ts                # Product, ProductFilters, etc.
├── cart.ts                   # CartItem, CartTotals
├── order.ts                  # Order, OrderItem
├── api.ts                    # ApiError, PaginatedResponse
└── admin.ts                  # Analytics, etc.
\\\

## Important Implementation Details

### Cart Calculations (store/cart.store.ts)

- **Tax Rate**: 8.25% (configurable as TAX_RATE constant)
- **Free Shipping**: Orders ≥ \ get free shipping; otherwise \
- **Bulk Discount**: Orders ≥ \ get 10% off subtotal
- **Cart Item ID**: Composite key format {productId}-{size}-{color} to allow same product in different variants

### Product Filtering & Pagination

- **Infinite Query**: Client-side infinite scroll using cursor-based pagination
- **Filters**: search, category, size, price range (min/max), sort
- **Sort Options**: featured (default), newest, price-asc, price-desc, rating
- **Mock Cursor**: For mock mode, cursor is just page number stringified (e.g., "2")

### Protected Routes & Middleware

- **Protected Routes**: /checkout, /orders, /admin, /wishlist
- **Auth Routes**: /login, /register redirect to /orders if already authenticated
- **Session Cookies**: Middleware checks clouthes.session and clouthes.refresh cookies
- **Redirect Flow**: Missing session on protected route redirects to /login?next=/original-path

### Form Validation

- All forms use React Hook Form + Zod
- Schemas defined in features/*/schemas/*.ts
- Zod infers TypeScript types for form values
- Example: loginSchema validates email and password (≥8 chars)

## Testing Strategy

- **Unit Tests**: Jest with React Testing Library
- **Configuration**: jest.config.js points to jest.setup.ts for DOM setup
- **Module Mapping**: @/* aliases work in tests via moduleNameMapper
- **Run Single Test**: npm run test -- --testNamePattern="test description"

## Performance Optimizations

- **Image Optimization**: Next.js Image component with remote patterns (Unsplash, Cloudinary, Shopify CDN)
- **Font Loading**: Google Fonts (Inter, Space Grotesk) with swap display strategy
- **Code Splitting**: Automatic per-route splitting with Next.js
- **Package Imports**: Optimized imports for lucide-react, framer-motion, recharts in next.config.mjs
- **Experimental**: webpackBuildWorker: false (disabled for stability)

## SEO & Metadata

- **Root Metadata**: Defined in app/layout.tsx (title template, OG, Twitter cards)
- **Page Overrides**: Each page can export Metadata object
- **JSON-LD**: <JsonLd /> component in root layout for structured data
- **Canonical URLs**: Set via alternates.canonical in metadata

## Common Workflows

### Adding a New Feature with API Integration

1. Create folder in features/{featureName}/
2. Add services/{featureName}.service.ts with mock + API branches
3. Create hooks in hooks/use-{feature}.ts using TanStack Query
4. Build components in components/
5. Add Zod schemas in schemas/ if forms are needed
6. Create page in app/{featureName}/page.tsx
7. Add types to types/{featureName}.ts
8. Register endpoints in services/endpoints.ts

### Implementing Form Submission

1. Define Zod schema in feature folder
2. Create component with useForm from react-hook-form
3. Use custom hook (e.g., useLogin()) that returns mutation from useMutation()
4. Access mutate, isPending, error from hook
5. Handle onSuccess and onError with toast notifications

### Adding a Protected Page

1. Import Protected from @/features/auth/components/protected
2. Wrap page content: <Protected><Content /></Protected>
3. Ensure middleware matcher includes route in middleware.ts
4. Redirect logic handled by middleware; Protected component shows spinner if loading

## Code Style & Conventions

- **File Naming**:
  - Components: PascalCase (Header.tsx)
  - Utilities: camelCase (format.ts)
  - Hooks: use- prefix (use-products.ts)
  - Stores: *.store.ts
  - Services: *.service.ts
  - Schemas: *.schemas.ts
- **Imports**: Always use @/ alias paths
- **Props Typing**: Inline React.FC types or extracted interfaces
- **"use client"**: Added at top of files using browser APIs, hooks, or state
- **Suspense**: Wrap async components with Suspense boundaries and loading UI

## Debugging Tips

- **Enable Real API**: Set NEXT_PUBLIC_ENABLE_MOCKS=false and ensure backend is running
- **Check Auth**: Open DevTools → Application → Cookies for clouthes.session and clouthes.refresh
- **Query Cache**: Inspect TanStack Query state in browser (install React Query DevTools)
- **Form Errors**: React Hook Form logs validation errors; check console
- **API Errors**: getApiError() normalizes axios errors; check error.message in catch blocks