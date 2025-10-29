import { Hero } from "@/components/shared/Hero";
import { FeatureCards } from "@/components/shared/FeatureCards";
import { CategoryShowcase } from "@/components/shared/CategoryShowcase";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { RecentlyAdded } from "@/components/home/RecentlyAdded";
import { FlashDeals } from "@/components/home/FlashDeals";
import { ProductBundles } from "@/components/home/ProductBundles";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { BlogHighlights } from "@/components/home/BlogHighlights";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Immersive banner with carousel */}
      <Hero />
      
      {/* Service Highlights - Trust indicators */}
      <FeatureCards />
      
      {/* Shop by Category - Visual category grid */}
      <CategoryShowcase />
      
      {/* Recently Added Products - New arrivals */}
      <RecentlyAdded />
      
      {/* Featured Products - Best sellers */}
      <FeaturedProducts />
      
      {/* Flash Deals - Timer-based promotions */}
      {/* <FlashDeals /> */}
      
      {/* Product Bundles - Smart curated combos */}
      {/* <ProductBundles /> */}
      
      {/* Shop by Brand - Brand carousel */}
      {/* <BrandsCarousel /> */}
      
      {/* Blog Highlights - Tech insights */}
      {/* <BlogHighlights /> */}
      
      {/* Customer Reviews - Social proof */}
      {/* <CustomerReviews /> */}
      
      {/* Newsletter & App Download */}
      <Newsletter />
    </div>
  );
}
