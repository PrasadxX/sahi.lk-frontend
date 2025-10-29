# Sahi.LK Customer Storefront

Modern, scalable Next.js 14+ storefront for Sahi.LK electronics store built with TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query)
- **State Management**: Zustand (for cart/global state)
- **Form Handling**: React Hook Form + Zod
- **Image Optimization**: Next.js Image component

## 📁 Project Structure

```
storefront/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main layout group
│   │   ├── layout.tsx            # Root layout with navbar/footer
│   │   ├── page.tsx              # Home page
│   │   ├── products/             # Products pages
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout flow
│   │   └── ...
│   ├── (auth)/                   # Auth pages (login/register)
│   ├── account/                  # Protected user area
│   ├── api/                      # API routes
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # React Query & other providers
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Navbar, Footer, etc.
│   ├── product/                  # Product-related components
│   ├── cart/                     # Cart components
│   └── shared/                   # Shared components
├── lib/                          # Utility functions
├── types/                        # TypeScript types
├── config/                       # App configuration
└── features/                     # Feature-based logic (optional)
```

## 🎨 Design System - White Theme

- **Primary Color**: Blue (#3B82F6) - Professional and trustworthy
- **Background**: Clean white with subtle gray accents
- **Typography**: Inter font family
- **Spacing**: Generous padding and margins
- **Shadows**: Subtle elevation with hover effects
- **Rounded Corners**: Consistent border radius (0.75rem)
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Installation & Setup

### 1. Install Dependencies

```powershell
cd storefront
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `storefront` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# AWS S3 (for images)
NEXT_PUBLIC_S3_BUCKET_URL=https://prasad-next-ecommerce.s3.amazonaws.com

# Optional: Analytics, etc.
```

### 3. Run Development Server

```powershell
npm run dev
```

The storefront will be available at `http://localhost:3000`

## 📦 Key Features Implemented

### ✅ Completed

1. **Project Structure** - Scalable, modular architecture
2. **Tailwind CSS + shadcn/ui** - White theme with design tokens
3. **Layout Components** - Navbar, Footer, Mobile Navigation
4. **Home Page** - Hero, Feature Cards, Category Showcase
5. **Product Components** - ProductCard with animations
6. **Responsive Design** - Mobile-first approach

### 🚧 To Implement

- Product listing page with filters
- Product details page with gallery
- Shopping cart with Zustand
- Checkout flow
- User authentication
- Order history
- SEO metadata for all pages

## 🏗️ Architecture & Scalability

### Component Organization

**1. UI Components (`components/ui/`)**
- Reusable shadcn/ui primitives
- Button, Card, Input, Badge, etc.
- No business logic, purely presentational

**2. Feature Components**
- `product/` - Product-specific components
- `cart/` - Cart-related components
- `layout/` - Layout components
- `shared/` - Shared across features

**3. Separation of Concerns**
- **Presentation**: React components
- **Business Logic**: Custom hooks in `features/`
- **Data Fetching**: TanStack Query hooks
- **State**: Zustand stores for global state
- **Types**: TypeScript interfaces in `types/`

### Scalability Features

**1. Modular Architecture**
- Easy to add new features without affecting existing code
- Feature-based folder structure when needed
- Clear component boundaries

**2. Performance Optimization**
- Next.js Image for optimized images
- Code splitting with dynamic imports
- React Query for caching and background updates
- Optimized bundle size

**3. Type Safety**
- Full TypeScript coverage
- Shared types between frontend and API
- Compile-time error checking

**4. State Management**
- React Query for server state (products, orders)
- Zustand for client state (cart, UI preferences)
- Minimal prop drilling

**5. Developer Experience**
- ESLint + TypeScript for code quality
- Consistent naming conventions
- Self-documenting code

## 🎯 How to Scale This Architecture

### Adding a New Feature (e.g., Wishlist)

1. **Create feature folder**:
   ```
   features/wishlist/
   ├── hooks/
   │   └── useWishlist.ts
   ├── components/
   │   ├── WishlistButton.tsx
   │   └── WishlistSheet.tsx
   └── store/
       └── wishlistStore.ts
   ```

2. **Create Zustand store** (`wishlistStore.ts`):
   ```typescript
   import { create } from 'zustand'
   
   interface WishlistStore {
     items: string[]
     addItem: (productId: string) => void
     removeItem: (productId: string) => void
   }
   
   export const useWishlistStore = create<WishlistStore>((set) => ({
     items: [],
     addItem: (productId) => set((state) => ({ 
       items: [...state.items, productId] 
     })),
     removeItem: (productId) => set((state) => ({ 
       items: state.items.filter(id => id !== productId) 
     })),
   }))
   ```

3. **Use in components**:
   ```typescript
   import { useWishlistStore } from '@/features/wishlist/store/wishlistStore'
   
   function ProductCard({ product }) {
     const { addItem } = useWishlistStore()
     // ...
   }
   ```

### Adding New Product Categories

1. Update `config/site.ts` with new category
2. Add category route: `app/(main)/products/[category]/page.tsx`
3. Update CategoryShowcase component
4. No changes needed to existing components!

### Adding User Reviews

1. Create `types/review.ts`
2. Create `components/product/ProductReviews.tsx`
3. Add API route: `app/api/reviews/route.ts`
4. Create React Query hook: `features/reviews/hooks/useReviews.ts`
5. Import into ProductDetails page

## 🔄 Integration with Existing Admin Panel

The storefront connects to the same API as `sahi-admin`:

- **Products API**: `GET /api/products`
- **Orders API**: `POST /api/orders`
- **Categories API**: `GET /api/categories`

No changes required to the admin panel. They share the same backend models and API.

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1400px /* Extra large */
```

## 🎨 Component Examples

### Button Usage
```typescript
import { Button } from '@/components/ui/button'

<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button size="lg">Large Button</Button>
```

### Card Usage
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```

## 🚀 Deployment

### Vercel (Recommended)

```powershell
npm install -g vercel
vercel
```

### Build for Production

```powershell
npm run build
npm start
```

## 📝 Notes

- **Admin Panel**: Located in `sahi-admin/` - DO NOT MODIFY
- **Shared Models**: Use existing MongoDB models from admin
- **API Routes**: Can reuse or extend existing API routes
- **Images**: Stored in AWS S3, referenced by URL

## 🤝 Contributing

When adding new features:
1. Follow the existing folder structure
2. Use TypeScript for type safety
3. Add JSDoc comments for complex functions
4. Keep components small and focused
5. Use React Query for data fetching
6. Add loading and error states

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query/latest)

---

Built with ❤️ for Sahi.LK
