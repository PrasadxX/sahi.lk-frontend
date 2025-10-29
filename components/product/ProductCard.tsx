"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || "/placeholder-product.jpg";
  const { addItem } = useCartStore();

  // Calculate price display for variants
  const getPriceDisplay = () => {
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return formatPrice(minPrice);
      }
      return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
    }
    return formatPrice(product.price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Don't allow direct add to cart for variant products
    if (product.hasVariants) {
      // Navigate to product page instead
      window.location.href = `/products/${product.slug || product._id}`;
      return;
    }
    
    addItem({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: mainImage,
      slug: product.slug,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <Link href={`/products/${product.slug || product._id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 h-full cursor-pointer">
          <CardContent className="p-0 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative w-full h-56 overflow-hidden bg-gray-100">
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-110 p-2"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.featured && (
                <Badge className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-0.5">Featured</Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">Out of Stock</Badge>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-3 flex flex-col text-center h-40">
            {product.category && (
              <div className="text-[10px] text-gray-500 uppercase tracking-wide font-medium mb-1">
                {product.category.name}
              </div>
            )}
            
            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug min-h-[2.5rem] mb-2">
              {product.title}
            </h3>
            
            <div className="mt-auto flex flex-col items-center gap-2">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {getPriceDisplay()}
                </div>
              </div>
              
              <Button
                size="sm"
                className="rounded-full h-8 text-xs px-3"
                disabled={!product.inStock && !product.hasVariants}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                {product.hasVariants ? 'View' : 'Add'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    </Link>
  );
}
