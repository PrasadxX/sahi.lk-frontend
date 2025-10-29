"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, ArrowRight, Sparkles, Zap, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface FeaturedProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
  slug?: string;
  isActive: boolean;
  inStock?: boolean;
}

export function Hero() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();

  // Fetch featured products
  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // Step 1: Get featured product IDs from settings
        const settingsRes = await axios.get('/api/settings');
        
        // Find the featuredProductIds setting
        const featuredSetting = settingsRes.data.find(
          (setting: any) => setting.name === 'featuredProductIds'
        );
        const featuredIds = featuredSetting?.value || [];

        if (featuredIds.length > 0) {
          // Step 2: Fetch all products
          const productsRes = await axios.get('/api/products');
          const allProducts = productsRes.data;

          // Step 3: Filter featured products (maintain order from settings)
          const featured = featuredIds
            .map((id: string) => 
              allProducts.find((p: FeaturedProduct) => p._id.toString() === id.toString())
            )
            .filter(Boolean) // Remove undefined items
            .slice(0, 5); // Limit to 5 featured products
          
          // If no featured products found, use all available products
          if (featured.length === 0) {
            const fallback = allProducts.slice(0, 5);
            setFeaturedProducts(fallback);
          } else {
            setFeaturedProducts(featured);
          }
        } else {
          // Fallback: show first 5 active products if no featured set
          const productsRes = await axios.get('/api/products');
          const fallback = productsRes.data.slice(0, 5);
          setFeaturedProducts(fallback);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback: try to fetch some products anyway
        try {
          const productsRes = await axios.get('/api/products');
          const fallback = productsRes.data.slice(0, 5);
          setFeaturedProducts(fallback);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setFeaturedProducts([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (featuredProducts.length < 2) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  const handleAddToCart = (product: FeaturedProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      slug: product.slug || product._id,
    });

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="h-[600px] bg-gradient-to-r from-violet-200 to-indigo-300 animate-pulse rounded-3xl"></div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <Badge className="mx-auto bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
              <Sparkles className="mr-1 h-4 w-4" />
              Welcome to Sahi.LK
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-violet-600 to-indigo-600">
              The Future of Tech, Delivered.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
              Explore authentic gadgets, PCs & accessories at the best prices in Sri Lanka.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-lg px-8">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-violet-300 hover:bg-violet-50 text-lg px-8">
                <Link href="/products?deals=true">
                  View Weekly Offers
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  const currentProduct = featuredProducts[activeIndex];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-950 py-8 lg:py-12">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-600/20 via-transparent to-transparent"></div>
        
        {/* Tech Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        {/* Circuit Pattern - Dotted Grid */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Glowing Orbs with Screen Blend Mode */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-violet-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-400/20 rounded-full mix-blend-screen filter blur-[80px] animate-blob animation-delay-4000"></div>
        
        {/* Spotlight Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,139,250,0.12),transparent_60%)]"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 -translate-x-full animate-shimmer"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center max-w-7xl mx-auto">
          {/* Left Side - Enhanced Product Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct._id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="space-y-3 md:space-y-4 text-white order-2 lg:order-1"
            >
              {/* Enhanced Product Title */}
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-[1.1] tracking-tight text-white relative"
                style={{
                  textShadow: '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.2)'
                }}
              >
                {currentProduct.title}
              </motion.h1>

              {/* Divider Line */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="h-[2px] w-20 bg-gradient-to-r from-violet-300 via-purple-300 to-transparent rounded-full shadow-lg shadow-violet-400/50"
              />

              {/* Enhanced Description with Icons */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-3"
              >
                <p className="text-xs sm:text-sm lg:text-base text-white leading-relaxed line-clamp-2 max-w-xl font-normal">
                  {currentProduct.description}
                </p>
                
                {/* Quick Info Icons */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-white/90 font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <span className="text-xs">✓</span>
                    </div>
                    <span>Authentic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <span className="text-xs">🚚</span>
                    </div>
                    <span>Fast Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                      <span className="text-xs">🔒</span>
                    </div>
                    <span>Secure Payment</span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Price Section with Original Price */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-wrap items-end gap-5"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-white/60 line-through font-medium">
                      {formatPrice(currentProduct.price * 1.25)}
                    </span>
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg shadow-orange-500/30">
                      -20% OFF
                    </Badge>
                  </div>
                  <span 
                    className="text-5xl sm:text-6xl lg:text-7xl font-black text-emerald-300"
                    style={{
                      textShadow: '0 0 30px rgba(110, 231, 183, 0.5), 0 0 60px rgba(110, 231, 183, 0.3)'
                    }}
                  >
                    {formatPrice(currentProduct.price)}
                  </span>
                </div>
                {currentProduct.category && (
                  <Badge className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-2 text-sm font-bold mb-2 shadow-lg shadow-white/10">
                    {currentProduct.category.name}
                  </Badge>
                )}
              </motion.div>

              {/* Enhanced Stock Status */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex items-center gap-3"
              >
                {currentProduct.inStock !== false ? (
                  <div className="flex items-center gap-2 bg-emerald-500/30 backdrop-blur-md border border-emerald-300/70 rounded-full px-4 py-2 shadow-lg shadow-emerald-500/30">
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse shadow-lg shadow-emerald-300/70"></div>
                    <span className="text-emerald-50 font-bold text-xs">In Stock</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-red-500/30 backdrop-blur-md border border-red-300/70 rounded-full px-4 py-2 shadow-lg">
                    <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                    <span className="text-red-50 font-bold text-xs">Out of Stock</span>
                  </div>
                )}
              </motion.div>

              {/* Enhanced Action Buttons with Stronger CTAs */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Button
                  size="lg"
                  disabled={currentProduct.inStock === false}
                  onClick={(e) => handleAddToCart(currentProduct, e)}
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 hover:from-violet-500 hover:via-purple-500 hover:to-violet-600 text-white hover:scale-[1.03] active:scale-95 text-base px-12 h-16 font-bold rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all duration-300 group border border-violet-400/30"
                >
                  <ShoppingCart className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Add to Cart
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/60 hover:scale-[1.03] active:scale-95 text-base px-12 h-16 font-bold rounded-2xl transition-all duration-300 group relative overflow-hidden shadow-lg"
                >
                  <Link href={`/products/${currentProduct.slug || currentProduct._id}`}>
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                    View Details
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                
              </motion.div>

              {/* Enhanced Navigation Dots */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-2 pt-2"
              >
                <div className="flex gap-1.5">
                  {featuredProducts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === activeIndex
                          ? "bg-white w-10 shadow-lg shadow-white/50"
                          : "bg-white/40 w-2 hover:bg-white/60 hover:w-6"
                      }`}
                      aria-label={`Go to product ${index + 1}`}
                    />
                  ))}
                </div>
                <span className="text-white/80 text-xs font-semibold ml-1">
                  {activeIndex + 1} / {featuredProducts.length}
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right Side - Enhanced 3D Product Image with Floating Card */}
          <div className="relative h-[280px] sm:h-[320px] lg:h-[380px] order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct._id}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                transition={{ 
                  duration: 0.7, 
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="relative h-full group perspective-1000"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Glow Spotlight Effect Behind Product */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute inset-0 -z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-purple-500/30 to-pink-500/30 rounded-full filter blur-[80px] group-hover:blur-[100px] transition-all duration-500"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-br from-white/10 to-transparent rounded-full filter blur-3xl"></div>
                </motion.div>

                {/* 3D Floating Card Frame */}
                <motion.div
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    rotateX: -2,
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/30 shadow-[0_20px_80px_-20px_rgba(139,92,246,0.5)] overflow-hidden group-hover:shadow-[0_25px_100px_-20px_rgba(139,92,246,0.7)] transition-all duration-500"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Inner Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400/10 via-purple-500/5 to-transparent"></div>
                  
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  
                  {/* Rotating Subtle Motion Effect */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{ 
                      duration: 20,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-purple-500/5 rounded-[2.5rem]"
                  ></motion.div>
                  
                  {/* Product Image Container with Enhanced Hover */}
                  <div className="relative h-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.08, rotateZ: 2 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="relative w-full h-full max-w-sm mx-auto"
                    >
                      <Image
                        src={currentProduct.images[0] || "/placeholder.jpg"}
                        alt={currentProduct.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
                        className="object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)] group-hover:drop-shadow-[0_25px_80px_rgba(139,92,246,0.6)] transition-all duration-500"
                        priority
                      />
                      
                      {/* Product Glow on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-violet-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-2xl"></div>
                    </motion.div>
                  </div>

                  {/* Enhanced Hot Deal Badge with Animation */}
                  <div className="absolute top-4 right-4 z-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white border-0 px-3 py-1.5 shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-shadow text-xs font-bold">
                        <Zap className="mr-1 h-3.5 w-3.5 fill-white animate-pulse" />
                        Hot Deal
                      </Badge>
                    </motion.div>
                  </div>

                  {/* 3D Depth Lines */}
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-white/20 rounded-tl-2xl"></div>
                    <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-white/20 rounded-br-2xl"></div>
                  </div>
                </motion.div>

                {/* Enhanced Decorative Floating Orbs */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -bottom-8 -right-8 w-56 h-56 bg-gradient-to-br from-violet-500/40 via-purple-500/30 to-pink-500/40 rounded-full filter blur-[80px] -z-10 group-hover:blur-[100px] transition-all duration-500"
                ></motion.div>
                <motion.div
                  animate={{ 
                    y: [0, 20, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-400/40 via-indigo-500/30 to-purple-500/40 rounded-full filter blur-[60px] -z-10 group-hover:blur-[80px] transition-all duration-500"
                ></motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Enhanced Navigation Arrows with Preview */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-1">
              <motion.button
                whileHover={{ scale: 1.15, x: -6 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length)}
                className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/30 backdrop-blur-xl border-2 border-white/50 hover:bg-white/40 hover:border-white/70 transition-all flex items-center justify-center text-white shadow-2xl hover:shadow-violet-500/50 group"
                aria-label="Previous product"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              {/* Next Product Preview */}
              {featuredProducts.length > 1 && (
                <motion.button
                  whileHover={{ scale: 1.15, x: 6 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveIndex((prev) => (prev + 1) % featuredProducts.length)}
                  className="pointer-events-auto relative group"
                  aria-label="Next product"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/30 backdrop-blur-xl border-2 border-white/50 hover:bg-white/40 hover:border-white/70 transition-all flex items-center justify-center text-white shadow-2xl hover:shadow-violet-500/50">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  {/* Next Product Mini Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-white/50 min-w-[180px]">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-violet-100 to-purple-100 flex-shrink-0">
                          <Image
                            src={featuredProducts[(activeIndex + 1) % featuredProducts.length]?.images[0] || "/placeholder.jpg"}
                            alt="Next product"
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-violet-900 truncate">
                            {featuredProducts[(activeIndex + 1) % featuredProducts.length]?.title}
                          </p>
                          <p className="text-xs font-semibold text-emerald-600">
                            {formatPrice(featuredProducts[(activeIndex + 1) % featuredProducts.length]?.price || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-violet-200">
                        <p className="text-[10px] text-violet-600 font-medium flex items-center gap-1">
                          <ArrowRight className="w-3 h-3" />
                          Next Product
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-6 lg:mt-8 pt-4 border-t border-white/20"
        >
          <p className="text-white text-sm font-semibold mb-3">
            Discover More Amazing Products
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white/50 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/70 hover:scale-105 active:scale-95 transition-all rounded-xl px-5 h-10 font-bold group"
            >
              <Link href="/products">
                <span className="flex items-center gap-2">
                  <span className="text-xs">View All Products</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white border-0 hover:scale-105 active:scale-95 transition-all rounded-xl px-5 h-10 font-bold shadow-xl shadow-orange-500/30 group"
            >
              <Link href="/products?deals=true">
                <span className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 fill-white group-hover:rotate-12 transition-transform" />
                  <span className="text-xs">Flash Deals</span>
                </span>
              </Link>
            </Button>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-white">
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-sm">🔒</span>
              </div>
              <span className="text-[11px] font-semibold">Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-sm">⚡</span>
              </div>
              <span className="text-[11px] font-semibold">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-sm">✓</span>
              </div>
              <span className="text-[11px] font-semibold">Quality Guaranteed</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
