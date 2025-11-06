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
      <Card className="group h-full border-2 border-slate-200 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden bg-white">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-violet-50 to-purple-50 overflow-hidden">
            <Image
              src={mainImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges - Top Left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {/* Stock Status Badge - Always show */}
              {!product.hasVariants && (
                product.inStock !== false ? (
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-lg">
                    In Stock
                  </Badge>
                ) : (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                    Out of Stock
                  </Badge>
                )
              )}
              {/* Featured Badge */}
              {product.featured && (
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-lg">
                  Featured
                </Badge>
              )}
            </div>

            {/* Quick Add Button */}
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock && !product.hasVariants}
              className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-violet-600 hover:bg-violet-700 text-white rounded-full w-10 h-10 p-0 shadow-xl"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-2">
            {/* Category */}
            {product.category && (
              <Badge variant="outline" className="text-xs font-medium text-violet-700 border-violet-300">
                {product.category.name}
              </Badge>
            )}

            {/* Title */}
            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-violet-700 transition-colors min-h-[3rem]">
              {product.title}
            </h3>

            {/* Price Only */}
            <div className="pt-2">
              <span className="text-2xl font-black text-violet-700">
                {getPriceDisplay()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
