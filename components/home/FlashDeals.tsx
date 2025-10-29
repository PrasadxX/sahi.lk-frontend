"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Clock, ShoppingCart, ArrowRight } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

export function FlashDeals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 14,
    seconds: 36,
  });

  const { data: products } = useProducts();
  const { addItem } = useCartStore();

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get featured products for flash deals (first 3)
  const dealProducts = products?.slice(0, 3) || [];

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.hasVariants) {
      return;
    }
    
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    });

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const stockPercentage = 35; // Demo stock remaining percentage

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <Zap className="mr-1 h-4 w-4" />
            Limited Time Offer
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
            ⚡ Flash Deals
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Don't miss out on these incredible limited-time offers
          </p>

          {/* Countdown Timer */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <Clock className="h-6 w-6 text-red-500" />
            <div className="flex gap-2">
              <div className="flex flex-col items-center bg-white rounded-lg p-3 min-w-[70px] shadow-md">
                <span className="text-3xl font-bold text-red-600">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-xs text-slate-600">Hours</span>
              </div>
              <div className="flex flex-col items-center bg-white rounded-lg p-3 min-w-[70px] shadow-md">
                <span className="text-3xl font-bold text-red-600">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-xs text-slate-600">Minutes</span>
              </div>
              <div className="flex flex-col items-center bg-white rounded-lg p-3 min-w-[70px] shadow-md">
                <span className="text-3xl font-bold text-red-600">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-xs text-slate-600">Seconds</span>
              </div>
            </div>
          </div>

          {/* Stock Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-600">Stock remaining</span>
              <span className="font-semibold text-red-600">{stockPercentage}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${stockPercentage}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/products/${product.slug || product._id}`}>
                <Card className="group overflow-hidden border-2 border-red-200 hover:border-red-400 hover:shadow-2xl transition-all duration-300 h-full cursor-pointer">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative h-56 bg-white overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.title}
                        fill
                        className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Discount Badge */}
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-sm px-3 py-1">
                        <Zap className="mr-1 h-3 w-3" />
                        20% OFF
                      </Badge>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 bg-white">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-2xl font-bold text-red-600">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-sm text-slate-400 line-through">
                          {formatPrice(Math.floor(product.price * 1.25))}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.hasVariants ? "View Options" : "Add to Cart"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline" className="border-2 border-red-300 hover:bg-red-50">
            <Link href="/products">
              View All Deals
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
