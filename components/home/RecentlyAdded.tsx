"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface Product {
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
  inStock?: boolean;
}

export function RecentlyAdded() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchRecentProducts() {
      try {
        const response = await axios.get("/api/products");
        // Get the 8 most recent products
        const recentProducts = response.data.slice(0, 8);
        setProducts(recentProducts);
      } catch (error) {
        console.error("Error fetching recent products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentProducts();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
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
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-violet-50/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-violet-50/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            New Arrivals
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-violet-700 to-purple-900">
            Recently Added Products
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover our latest tech arrivals - Fresh inventory just for you
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.slug || product._id}`}>
                <Card className="group h-full border-2 border-slate-200 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 overflow-hidden bg-white">
                  <CardContent className="p-0">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-violet-50 to-purple-50 overflow-hidden">
                      <Image
                        src={product.images[0] || "/placeholder.jpg"}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* New Badge */}
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-lg">
                        NEW
                      </Badge>

                      {/* Quick Add Button */}
                      <Button
                        size="sm"
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.inStock === false}
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

                      {/* Price & Stock */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-black text-violet-700">
                          {formatPrice(product.price)}
                        </span>
                        {product.inStock !== false ? (
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50">
                            In Stock
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all duration-300 rounded-full px-8"
          >
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
