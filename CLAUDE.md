# Astroapp Template

Frontend built with Vite + React + TypeScript, following the team's standard architecture (originally established in `pharmaride-web`).

## Stack

- **Build tool**: Vite
- **Language**: TypeScript
- **UI**: React (functional components + hooks only, no class components)
- **Routing**: react-router-dom (v7) — all routes declared in `src/App.tsx`
- **Global state**: Zustand — one store per domain in `src/store/`
- **HTTP**: axios via a centralized client in `src/api/callApi.ts`
- **Styling**: Tailwind CSS (v4, CSS-first config via `@theme` in `src/index.css` — no `tailwind.config.js`)
- **Toasts**: sonner
- **Icons**: @tabler/icons-react

## Folder structure & where new code goes

```
src/
  View/<PageName>/<PageName>.tsx       one folder per route/page
  View/<PageName>/components/          sub-components used ONLY by that page
  Components/                          reusable, domain-aware components used by 2+ pages
  Components/Common/                   generic, domain-agnostic UI primitives (Modal, Spinner, Button...)
  Layout/                              Header, Footer, Layout.tsx (persistent app shell)
  store/                               Zustand stores, one per domain (useCartStore.ts, useAuthStore.ts...)
  api/                                 callApi.ts (axios client), urlApi.ts (endpoint map), types.ts
  hooks/                               reusable logic that uses React state/effects (useX naming)
  Utils/                               pure helper functions, NO React involved
  config/                              app-wide constants / env-derived config
  assets/                              images, lottie json, static files
```

**Decision rule for a new component:** only used by one page → put it in `View/<Page>/components/`. Used by 2+ pages and still domain-specific → `src/Components/`. Fully generic, no domain knowledge → `src/Components/Common/`.

**Decision rule for new logic:** touches React state/effects/DOM → `hooks/`. Pure input→output, no React → `Utils/`. Talks to the backend → belongs inside a `store/` action, which calls `api/`.

## Component conventions

- Functional components typed as `React.FC<XxxProps>`.
- Props interface named `<ComponentName>Props`, declared just above the component.
- Default export at the bottom of the file.
- Conditional rendering: `{condition && <X/>}` or ternaries — never `if` statements inside JSX.
- Event handlers passed as function references (`onClick={handleClick}`), not strings.

## State management rules

- `useState` for state local to one component (or its direct children via props).
- Zustand store for anything shared across unrelated components or that must survive route changes (auth, cart, wishlist, profile, settings).
- Never mutate state directly — always go through `setX(...)` (useState) or `set({...})` (Zustand).
- When a state update depends on the previous value, use the functional updater form: `setX(prev => ...)`.
- Store actions call the `api/` layer directly and update state with `set()`. Components never call `axios`/`callApi` directly — they go through a store action.
- Use optimistic updates for mutations where reasonable (update state immediately, roll back in the `catch` block if the request fails) — see `addToCart`/`removeItem` pattern in the reference implementation.
- Inside a store action needing another part of the same store, use `useXStore.getState()` (hooks can't be called outside components).

## API layer rules

- Every backend endpoint is defined **once**, in `src/api/urlApi.ts`, grouped by domain (`urlApi.cart.getCart`, `urlApi.products.getProductDetails(id)`). Never hardcode a URL string inside a component or store.
- All HTTP calls go through the wrapper functions in `src/api/callApi.ts` (`getApi`, `postApi`, `putApi`, `patchApi`, `deleteApi`) — never call `axios` directly elsewhere.
- These wrappers never throw past the call site — they always resolve to a normalized `ApiResult<T>` shape (`{ status, data, message }`). Callers check `response.status === 'success'`, not try/catch.
- Auth token attachment, standard headers, and 401/expired-session handling live in the axios interceptors in `callApi.ts` — do not re-implement auth header logic in individual stores/components.

## Styling rules

- Tailwind utility classes inline in `className`. Avoid separate `.css`/`.module.css` files per component.
- Brand colors/design tokens defined once in `src/index.css` under `@theme` (and mirrored as plain CSS vars under `:root` if raw-CSS-variable references are needed). Use the token classes (`bg-primary`, `text-accent`) rather than hardcoded hex values.
- Arbitrary values (`text-[13px]`) are an escape hatch, not the default — if a value repeats, promote it to a token or a named class in `index.css`.
- Responsive: mobile-first, using `sm:`/`md:`/`lg:` prefixes.
- If a utility combination repeats across many unrelated components, extract it to a named class in `index.css` (see `.container-custom` in the reference implementation) instead of copy-pasting.

## Routing

- All routes declared in `src/App.tsx` inside a single `<Routes>` block.
- Auth-gated pages wrapped in `<ProtectedRoute>`.
- Page components live in `View/`, one folder per route.

## Testing workflow

- Don't run/drive the app yourself to verify changes (no dev server, no browser automation). After making a change, tell the user exactly what to click/check to verify it, and wait for them to test and report back.

## Reference implementation

The canonical, fully-worked example of every pattern above is the `pharmaride-web` project at `/home/saquib/devsaquib/react-learning/pharmaride-web` (same machine). If something here is ambiguous, look at how it's actually done there rather than guessing.

## What NOT to do

- Don't put page-specific components in the top-level `Components/` folder — keep them local to the page until a second page needs them.
- Don't call `axios`/`fetch` directly from a component — always go through a store action → `api/` wrapper.
- Don't hand-roll new CSS files for one-off component styling — use Tailwind utilities.
- Don't put non-React helper logic in `hooks/` — that's `Utils/`.
- Don't skip the props `interface` for a component, even a small one — it's the contract, same as a DTO type on the backend.
