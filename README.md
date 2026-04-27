# Clouthes Web

Production-ready Next.js App Router storefront for a premium t-shirt commerce platform.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Zustand for local client state
- TanStack Query for API caching
- Axios service layer for ASP.NET Core API integration
- React Hook Form and Zod for validated forms
- Framer Motion, Sonner, Recharts, Jest, Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Create `.env` from `.env.example` and point `NEXT_PUBLIC_API_URL` to the ASP.NET Core API.

## API Contract

The frontend expects JWT access tokens from `/auth/login`, `/auth/register`, and `/auth/refresh`. Refresh tokens should be issued by the backend as secure, HttpOnly, SameSite cookies. The Axios client sends credentials and retries one time after refresh on `401`.

## Quality Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```
