# 🚀 Sahi.LK Storefront - Setup Guide

Complete step-by-step guide to set up and run the new customer-facing storefront.

## 📋 Prerequisites

- Node.js 18+ and npm
- Windows PowerShell (your default shell)
- VS Code (recommended)

## 🔧 Step 1: Install Dependencies

Open PowerShell in the `storefront` directory:

```powershell
cd "c:\Users\prasa\Desktop\sahi.lk\storefront"
npm install
```

This will install:
- Next.js 15.1.7
- React 19
- TypeScript
- Tailwind CSS 4.0
- shadcn/ui components
- Framer Motion
- TanStack Query
- Zustand
- And all other dependencies

⏱️ **Time**: 2-3 minutes

## 🎨 Step 2: Configure Environment

Copy the example environment file:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_S3_BUCKET_URL=https://prasad-next-ecommerce.s3.amazonaws.com
```

## 🏃 Step 3: Run Development Server

Start the development server:

```powershell
npm run dev
```

The storefront will be available at:
- **URL**: http://localhost:3000
- **Hot Reload**: Enabled (changes reflect instantly)

⚠️ **Important**: Make sure the admin backend API is running on port 3001!

## 🔗 Step 4: Connect to Backend

The storefront needs the backend API running. You have two options:

### Option A: Use Existing Admin API

If `sahi-admin` is already running on port 3001, you're good to go!

```powershell
# In another terminal, go to sahi-admin
cd "c:\Users\prasa\Desktop\sahi.lk\sahi-admin"
npm run dev
```

### Option B: Share API with Both

The storefront reuses the same API routes. You can:

1. Keep admin running on port 3001
2. Storefront calls `http://localhost:3001/api/*`
3. No code duplication needed!

## 📱 Step 5: Test the Storefront

Visit http://localhost:3000 and verify:

✅ **Home Page**
- Hero section loads
- Feature cards display
- Category showcase appears
- Featured products show (if data exists)

✅ **Navigation**
- Navbar is sticky and responsive
- Mobile menu works on small screens
- Search bar expands on desktop
- Footer displays correctly

✅ **Responsive Design**
- Resize browser window
- Check mobile view (< 768px)
- Check tablet view (768px - 1024px)
- Check desktop view (> 1024px)

## 🔍 Step 6: Verify API Integration

### Check Products API

Open browser console (F12) and check network tab:

```
GET http://localhost:3001/api/products
```

Should return your products array.

### Test Endpoints

You can test these manually:

```powershell
# Get all products
curl http://localhost:3001/api/products

# Get categories
curl http://localhost:3001/api/categories
```

## 🎯 What's Been Built So Far

### ✅ Completed Features

1. **Project Structure**
   - Next.js 14+ App Router setup
   - TypeScript configuration
   - Tailwind CSS + shadcn/ui integration

2. **Core Components**
   - ✅ Navbar (sticky, responsive, with search)
   - ✅ Footer (with social links and categories)
   - ✅ Mobile Navigation (slide-out menu)
   - ✅ Hero Section (animated, engaging)
   - ✅ Feature Cards (Why Choose Sahi.LK)
   - ✅ Category Showcase (interactive cards)
   - ✅ Product Card (with hover effects)

3. **Pages**
   - ✅ Home Page (complete with all sections)
   - ⏳ Product Listing (next step)
   - ⏳ Product Details (next step)
   - ⏳ Cart (next step)
   - ⏳ Checkout (next step)

4. **Design System**
   - ✅ White theme with blue accents
   - ✅ Responsive breakpoints
   - ✅ Consistent spacing and typography
   - ✅ Smooth animations with Framer Motion

### 🚧 Next Steps

To complete the storefront, you'll need to build:

1. **Product Listing Page** (`/products`)
   - Grid layout with filters
   - Search functionality
   - Pagination
   - Sort options

2. **Product Details Page** (`/products/[slug]`)
   - Image gallery
   - Product specifications
   - Add to cart button
   - Related products

3. **Shopping Cart**
   - Cart state with Zustand
   - Cart sheet (slide-out)
   - Cart page
   - Update quantities

4. **Checkout Flow**
   - Customer information form
   - Delivery details
   - Order summary
   - Payment integration

5. **User Authentication**
   - Login/Register pages
   - Protected routes
   - User profile
   - Order history

## 📚 File Structure Explained

```
storefront/
├── app/
│   ├── layout.tsx              # Root layout (Inter font, metadata)
│   ├── providers.tsx           # React Query provider
│   ├── globals.css             # Tailwind + custom styles
│   └── (main)/
│       ├── layout.tsx          # Main layout (Navbar + Footer)
│       └── page.tsx            # Home page
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   ├── layout/                 # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── product/                # Product components
│   │   ├── ProductCard.tsx
│   │   └── FeaturedProducts.tsx
│   └── shared/                 # Shared components
│       ├── Hero.tsx
│       ├── FeatureCards.tsx
│       └── CategoryShowcase.tsx
├── lib/
│   └── utils.ts                # Utility functions (cn, formatPrice, etc.)
├── types/
│   ├── product.ts              # Product types
│   └── cart.ts                 # Cart types
└── config/
    └── site.ts                 # Site configuration
```

## 🎨 Customization Guide

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(221.2 83.2% 53.3%)", // Blue
        // Change this for different primary color
      },
    },
  },
}
```

### Adding New Sections

1. Create component in `components/shared/`
2. Import in `app/(main)/page.tsx`
3. Add to the page

Example:

```typescript
// components/shared/Testimonials.tsx
export function Testimonials() {
  return <section>...</section>
}

// app/(main)/page.tsx
import { Testimonials } from "@/components/shared/Testimonials"

export default function HomePage() {
  return (
    <>
      <Hero />
      <Testimonials /> {/* New section */}
      <FeatureCards />
    </>
  )
}
```

## 🐛 Troubleshooting

### Issue: "Cannot find module 'react'"

**Solution**: Dependencies not installed
```powershell
npm install
```

### Issue: "Port 3000 already in use"

**Solution**: Kill the process or use different port
```powershell
# Use different port
npm run dev -- -p 3002
```

### Issue: TypeScript errors in VS Code

**Solution**: Restart TypeScript server
1. Press `Ctrl + Shift + P`
2. Type "TypeScript: Restart TS Server"
3. Press Enter

### Issue: Tailwind classes not working

**Solution**: Restart dev server
```powershell
# Stop with Ctrl+C
npm run dev
```

### Issue: Images not loading

**Solution**: Check S3 bucket URL in `.env.local`
```env
NEXT_PUBLIC_S3_BUCKET_URL=https://prasad-next-ecommerce.s3.amazonaws.com
```

## 📊 Performance Checklist

Before going to production:

- [ ] Run `npm run build` successfully
- [ ] Check Lighthouse score (aim for 90+)
- [ ] Test on real mobile devices
- [ ] Optimize images (use Next.js Image)
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Configure caching headers
- [ ] Set up monitoring (Vercel Analytics, etc.)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. Push code to GitHub
2. Connect repo to Vercel
3. Vercel auto-deploys on push
4. Configure environment variables in Vercel dashboard

### Option 2: Manual Build

```powershell
npm run build
npm start
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the README.md for architecture details
3. Check Next.js documentation
4. Review shadcn/ui component docs

## 🎉 You're Ready!

Your modern storefront is set up and running. Next steps:

1. ✅ Verify everything works locally
2. 📝 Complete remaining pages (products, cart, checkout)
3. 🎨 Customize colors and branding
4. 🚀 Deploy to production
5. 📊 Monitor performance and user feedback

Happy coding! 🚀
