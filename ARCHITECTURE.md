# 🏗️ Sahi.LK Storefront Architecture

## Overview

This document explains the scalable architecture of the new customer-facing storefront for Sahi.LK.

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  (Next.js 14+ App Router, React 19, TypeScript)            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Layout     │  │   Product    │  │    Cart      │    │
│  │  Components  │  │  Components  │  │  Components  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │           shadcn/ui Components (UI Layer)             │ │
│  │   Button, Card, Input, Badge, Dialog, etc.           │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  React Query │  │   Zustand    │  │ Custom Hooks │    │
│  │  (Server     │  │  (Client     │  │  (Business   │    │
│  │   State)     │  │   State)     │  │   Logic)     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         Shared API Routes (Port 3001)                 │ │
│  │   /api/products  /api/orders  /api/categories        │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   MongoDB    │  │    AWS S3    │  │   External   │    │
│  │  (Database)  │  │   (Images)   │  │     APIs     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Folder Structure & Responsibility

### 1. **App Directory** (`app/`)

**Purpose**: Next.js 14+ App Router for routing and layouts

```
app/
├── layout.tsx                  # Root layout (fonts, metadata)
├── providers.tsx               # React Query, theme providers
├── globals.css                 # Global styles
│
├── (main)/                     # Main customer-facing pages
│   ├── layout.tsx              # Navbar + Footer layout
│   ├── page.tsx                # Home page
│   ├── products/
│   │   ├── page.tsx            # Product listing
│   │   └── [slug]/
│   │       └── page.tsx        # Product details
│   ├── cart/
│   │   └── page.tsx            # Shopping cart
│   └── checkout/
│       └── page.tsx            # Checkout flow
│
├── (auth)/                     # Authentication pages
│   ├── layout.tsx              # Auth-specific layout
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
│
├── account/                    # Protected user area
│   ├── layout.tsx              # Account layout
│   ├── page.tsx                # Profile
│   └── orders/
│       └── page.tsx            # Order history
│
└── api/                        # API routes (if needed)
    └── ...
```

**Scalability**:
- Route groups `(main)`, `(auth)` organize layouts without affecting URL structure
- Each feature has its own directory
- Easy to add new pages without touching existing code

---

### 2. **Components Directory** (`components/`)

**Purpose**: Reusable UI components organized by feature

```
components/
├── ui/                         # shadcn/ui primitives
│   ├── button.tsx              # Base button component
│   ├── card.tsx                # Card container
│   ├── input.tsx               # Form inputs
│   ├── badge.tsx               # Status badges
│   ├── dialog.tsx              # Modal dialogs
│   └── ...                     # Other UI primitives
│
├── layout/                     # Layout components
│   ├── Navbar.tsx              # Top navigation
│   ├── Footer.tsx              # Site footer
│   ├── MobileNav.tsx           # Mobile menu
│   └── SearchBar.tsx           # Search functionality
│
├── product/                    # Product feature
│   ├── ProductCard.tsx         # Product card in grid
│   ├── ProductGrid.tsx         # Grid container
│   ├── ProductFilters.tsx      # Filter sidebar
│   ├── ProductDetails.tsx      # Product detail view
│   ├── ProductGallery.tsx      # Image gallery
│   └── FeaturedProducts.tsx    # Featured section
│
├── cart/                       # Cart feature
│   ├── CartSheet.tsx           # Slide-out cart
│   ├── CartItem.tsx            # Individual cart item
│   ├── CartSummary.tsx         # Order summary
│   └── AddToCartButton.tsx     # Add to cart action
│
└── shared/                     # Shared components
    ├── Hero.tsx                # Landing hero section
    ├── FeatureCards.tsx        # Feature highlights
    ├── CategoryShowcase.tsx    # Category grid
    └── LoadingSpinner.tsx      # Loading states
```

**Principles**:
- **Single Responsibility**: Each component has one job
- **Composition**: Complex UI built from simple components
- **Reusability**: Components accept props for flexibility
- **No Business Logic**: Pure presentation only

---

### 3. **Features Directory** (`features/`) [Optional]

**Purpose**: Feature-specific business logic, hooks, and state

```
features/
├── products/
│   ├── hooks/
│   │   ├── useProducts.ts      # Fetch all products
│   │   ├── useProduct.ts       # Fetch single product
│   │   └── useProductFilters.ts # Filter logic
│   ├── api/
│   │   └── products.ts         # API functions
│   └── types/
│       └── index.ts            # Product-specific types
│
├── cart/
│   ├── hooks/
│   │   └── useCart.ts          # Cart hook
│   ├── store/
│   │   └── cartStore.ts        # Zustand cart store
│   └── utils/
│       └── cartHelpers.ts      # Cart calculations
│
└── auth/
    ├── hooks/
    │   └── useAuth.ts          # Auth hook
    ├── context/
    │   └── AuthContext.tsx     # Auth context
    └── api/
        └── auth.ts             # Auth API calls
```

**Benefits**:
- Business logic separated from UI
- Easy to test independently
- Can share logic between pages
- Clear dependency graph

---

### 4. **Library Directory** (`lib/`)

**Purpose**: Utility functions and shared logic

```
lib/
├── utils.ts                    # cn(), formatPrice(), etc.
├── api-client.ts               # Axios/fetch wrapper
├── constants.ts                # App-wide constants
└── validations.ts              # Zod schemas
```

**Contents**:
- `cn()`: Class name merger (clsx + tailwind-merge)
- `formatPrice()`: Currency formatting
- `formatDate()`: Date formatting
- API client configuration
- Validation schemas

---

### 5. **Types Directory** (`types/`)

**Purpose**: TypeScript interfaces and types

```
types/
├── product.ts                  # Product, Category types
├── cart.ts                     # Cart, CartItem types
├── order.ts                    # Order types
└── user.ts                     # User types
```

**Shared Types**: Used across components, hooks, and API

---

### 6. **Config Directory** (`config/`)

**Purpose**: App configuration and constants

```
config/
├── site.ts                     # Site metadata, links
└── navigation.ts               # Navigation links
```

---

## 🔄 Data Flow

### Example: Adding Product to Cart

```
User Clicks "Add to Cart" Button
            │
            ▼
   ProductCard Component
            │
            ├─> Calls addToCart(productId)
            │
            ▼
      useCartStore (Zustand)
            │
            ├─> Updates cart state
            ├─> Saves to localStorage
            │
            ▼
    Cart State Updates
            │
            ├─> React re-renders
            ├─> Cart badge updates
            │
            ▼
    Success Toast Shown
```

### Example: Fetching Products

```
Products Page Loads
            │
            ▼
    useProducts() Hook (React Query)
            │
            ├─> Checks cache
            │   └─> If cached: Return immediately
            │
            ├─> If not cached:
            │   └─> Fetch from API
            │
            ▼
    GET /api/products
            │
            ▼
    MongoDB Query
            │
            ▼
    Return Products Array
            │
            ▼
    React Query Caches Data
            │
            ▼
    ProductGrid Renders
            │
            └─> ProductCard for each product
```

---

## 🎯 State Management Strategy

### 1. **Server State** (React Query)

**What**: Data from API (products, orders, user profile)

**Why**: 
- Automatic caching
- Background refetching
- Loading/error states
- Optimistic updates

**Example**:
```typescript
const { data: products, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 60000, // 1 minute
})
```

---

### 2. **Client State** (Zustand)

**What**: UI state, cart, preferences

**Why**:
- Simple API
- No context wrapper needed
- Works outside React
- DevTools support

**Example**:
```typescript
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
}))
```

---

### 3. **URL State** (Next.js Router)

**What**: Filters, pagination, search

**Why**:
- Shareable URLs
- Browser history
- SEO friendly

**Example**:
```typescript
const searchParams = useSearchParams()
const category = searchParams.get('category')
```

---

## 🚀 Scalability Features

### 1. **Code Splitting**

- Next.js automatically splits code per route
- Dynamic imports for heavy components
- Reduces initial bundle size

```typescript
const HeavyComponent = dynamic(() => import('./Heavy'), {
  loading: () => <Spinner />
})
```

### 2. **Image Optimization**

- Next.js Image component auto-optimizes
- WebP format with fallback
- Lazy loading built-in

```typescript
<Image 
  src={product.image}
  alt={product.title}
  width={400}
  height={400}
  loading="lazy"
/>
```

### 3. **Caching Strategy**

- React Query caches API responses
- Stale-while-revalidate pattern
- Background updates

### 4. **Type Safety**

- Full TypeScript coverage
- Compile-time error checking
- Auto-completion in IDE

---

## 📈 Performance Optimizations

1. **Static Generation** where possible
2. **Incremental Static Regeneration** for products
3. **Lazy loading** for images and components
4. **Code splitting** per route
5. **Font optimization** with next/font
6. **Minification** in production build

---

## 🔐 Security Considerations

1. **Environment Variables**: Never expose secrets
2. **API Routes**: Validate all inputs
3. **CSRF Protection**: Use Next.js built-in
4. **XSS Prevention**: React auto-escapes
5. **Authentication**: Secure token handling

---

## 📱 Responsive Design

### Breakpoints

```
Mobile:  < 768px   (1 column)
Tablet:  768-1024px (2 columns)
Desktop: > 1024px   (4 columns)
```

### Strategy

- Mobile-first CSS
- Flexible grid system
- Touch-friendly UI
- Optimized images

---

## 🧪 Testing Strategy (Future)

1. **Unit Tests**: Components with Jest
2. **Integration Tests**: User flows with Testing Library
3. **E2E Tests**: Critical paths with Playwright
4. **Visual Tests**: Storybook + Chromatic

---

## 🎉 Summary

This architecture provides:

✅ **Scalability**: Easy to add features without breaking existing code
✅ **Maintainability**: Clear separation of concerns
✅ **Performance**: Optimized bundle size and loading
✅ **Developer Experience**: Type-safe, auto-complete, hot reload
✅ **User Experience**: Fast, responsive, accessible

---

**Built with modern best practices for long-term success! 🚀**
