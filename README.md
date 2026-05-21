# uThrive UI

A polished product catalogue and cart flow built with React, TypeScript, Tailwind, and shadcn/ui.

## Tech stack

| Layer | Tool | Why it was used |
|---|---|---|
| Framework | React 19 | Fast component-based UI with a clean mental model for product and cart flows |
| Language | TypeScript | Safer props, state, and product/cart data structures |
| Build tool | Vite | Very fast local development and simple production builds |
| Styling | Tailwind CSS | Quick UI iteration with consistent spacing, layout, and responsive utilities |
| UI primitives | shadcn/ui + Radix UI | Accessible dialogs, buttons, cards, toasts, and a solid default component base |
| Icons | Lucide React | Lightweight icons that fit the shadcn style |
| State management | React Context API | Keeps product and cart state simple, local, and easy to understand without extra libraries |
| Data source | Local JSON | Straightforward mock data with no service abstraction or backend dependency |
| Testing | Vitest + Testing Library | Good coverage for UI behavior in a Vite React project |

## State management

This app now uses basic Context API state instead of service-style abstractions.

- `ProductsProvider` stores the catalogue data loaded from `src/data/products.json`
- `CartProvider` stores cart items and exposes basic cart actions
- The cart API is intentionally simple:
  - `getCart`
  - `addToCart`
  - `removeFromCart`
  - `updateQuantity`
  - `clearCart`

This approach was chosen because the app is small and the user flow does not need Redux, Zustand, React Query, or a service layer.

## Product data

Product seed data lives in:

- `src/data/products.json`

That keeps the mock catalogue easy to edit and easy to understand.

## UI decisions

- Prices are formatted in naira using `Intl.NumberFormat`
- The app uses a cleaner Geist-based font setup
- The theme stays close to the default shadcn feel, but with warmer surfaces and slightly better card, modal, and cart styling
- Dialog and cart surfaces use solid backgrounds and clearer borders to avoid the transparent look

## Project structure

```text
src/
├── components/
│   ├── ui/
│   ├── CartDrawer.tsx
│   ├── ProductCard.tsx
│   ├── ProductDetailDialog.tsx
│   └── ProductFiltersBar.tsx
├── data/
│   └── products.json
├── hooks/
│   ├── useCart.tsx
│   ├── useProducts.ts
│   └── useToast.ts
├── lib/
│   ├── formatters.ts
│   └── utils.ts
├── __tests__/
│   ├── App.test.tsx
│   └── ProductCard.test.tsx
├── App.tsx
├── index.css
└── main.tsx
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
```

## Notes

- Product state resets on refresh because it is local mock data
- Cart state also resets on refresh because it is stored in Context only
- Archived products stay visible in the catalogue but use archived styling and controls
