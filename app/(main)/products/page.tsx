"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  SlidersHorizontal, 
  TrendingUp,
  DollarSign,
  Package,
  Filter,
  Search,
  X
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"latest" | "price-low" | "price-high" | "name">("latest");
  const [showFilters, setShowFilters] = useState(true);
  
  const { data: products, isLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Get search query from URL
  useEffect(() => {
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    
    if (search) {
      setSearchQuery(search);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products.filter((product) => {
      const matchesSearch = searchQuery === "" || 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        product.category?._id === selectedCategory ||
        product.category?.name === selectedCategory ||
        product.category?.slug === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-high":
        return filtered.sort((a, b) => b.price - a.price);
      case "name":
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case "latest":
      default:
        return filtered;
    }
  }, [products, searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(undefined);
    setSortBy("latest");
  };

  const hasActiveFilters = searchQuery || selectedCategory || sortBy !== "latest";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-violet-600 to-indigo-600 text-center">
            All Products
          </h1>
          <p className="text-slate-600 text-center">
            Discover our complete collection of premium electronics
          </p>
        </motion.div>

        {/* Large Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-slate-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/60 z-10" />
                  <input
                    type="search"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-16 pl-14 pr-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-all text-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                {/* Active Search Indicator */}
                {searchQuery && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="text-white/80 text-sm">
                      Showing results for: <span className="font-semibold text-white">&quot;{searchQuery}&quot;</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:col-span-1 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <Card className="p-6 border-slate-200 shadow-lg sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-violet-600" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <Package className="h-4 w-4 text-violet-600" />
                  Categories
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <Button
                    variant={!selectedCategory ? "default" : "outline"}
                    onClick={() => setSelectedCategory(undefined)}
                    className="w-full justify-start"
                    size="sm"
                  >
                    All Products
                    {!selectedCategory && products && (
                      <Badge variant="secondary" className="ml-auto">
                        {products.length}
                      </Badge>
                    )}
                  </Button>
                  {categoriesLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-9 bg-slate-200 animate-pulse rounded"></div>
                      ))}
                    </div>
                  ) : (
                    categories?.map((category) => {
                      const count = products?.filter(p => p.category?._id === category._id).length || 0;
                      return (
                        <Button
                          key={category._id}
                          variant={selectedCategory === category._id ? "default" : "outline"}
                          onClick={() => setSelectedCategory(category._id)}
                          className="w-full justify-start"
                          size="sm"
                        >
                          {category.name}
                          {count > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {count}
                            </Badge>
                          )}
                        </Button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium mb-3 block flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                  Sort By
                </label>
                <div className="space-y-2">
                  {[
                    { value: "latest", label: "Latest", icon: Package },
                    { value: "price-low", label: "Price: Low to High", icon: DollarSign },
                    { value: "price-high", label: "Price: High to Low", icon: DollarSign },
                    { value: "name", label: "Name: A to Z", icon: Filter },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? "default" : "outline"}
                      onClick={() => setSortBy(option.value as any)}
                      className="w-full justify-start"
                      size="sm"
                    >
                      <option.icon className="h-4 w-4 mr-2" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 flex items-center justify-between"
            >
              <p className="text-sm text-slate-600">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing <span className="font-semibold text-slate-900">{filteredAndSortedProducts.length}</span> of <span className="font-semibold">{products?.length || 0}</span> products
                    {searchQuery && (
                      <span> for "<span className="font-semibold text-violet-600">{searchQuery}</span>"</span>
                    )}
                  </>
                )}
              </p>
            </motion.div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedProducts.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr"
              >
                {filteredAndSortedProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    className="h-full"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                        },
                      },
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card className="p-12 text-center border-slate-200">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Try adjusting your search or filters
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearFilters} variant="outline">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-violet-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
