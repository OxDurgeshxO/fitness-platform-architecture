# FRONTEND GUIDELINES

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + CSS Variables for theming |
| State (server) | React Query (TanStack Query v5) |
| State (client) | Zustand |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Testing | Vitest + React Testing Library + Playwright |

## Every Page Must Include

- **Loading states** — skeleton loaders, not spinners alone
- **Empty states** — illustrated, actionable, not just "No data"
- **Error states** — user-friendly messages with retry actions
- **Accessibility** — ARIA labels, keyboard navigation, focus management
- **Dark mode** — CSS variable-based theme switching
- **Animations** — purposeful motion, respects `prefers-reduced-motion`
- **Responsive layouts** — mobile-first, tested at 320px, 768px, 1280px, 1920px
- **Lazy loading** — images, heavy components
- **Code splitting** — route-level + component-level where justified

## Component Rules

- Every component lives in `components/` with co-located tests and stories
- Props must be fully typed — no `any`
- Use **compound component pattern** for complex UI (Tabs, Modal, Dropdown)
- Extract reusable hooks into `hooks/`
- Never fetch data directly in components — use React Query hooks

## Performance Targets

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | < 0.1 |
| Bundle size (initial JS) | < 200KB gzipped |

## Folder Structure

```
src/
  app/           # Next.js App Router pages
  components/    # Shared UI components
  features/      # Feature-scoped components + hooks
  hooks/         # Global custom hooks
  lib/           # Utilities, API clients, constants
  stores/        # Zustand stores
  types/         # Shared TypeScript types
  styles/        # Global styles, Tailwind config
```
