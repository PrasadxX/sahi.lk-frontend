"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingCart, User, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig } from "@/config/site";
import { MobileNav } from "./MobileNav";
import { useCartStore } from "@/store/cart";
import { CartSheet } from "@/components/cart/CartSheet";
import { useCategories, useProducts } from "@/hooks/useProducts";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, openCart } = useCartStore();
  const { data: categories } = useCategories();
  const { data: products } = useProducts();
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query
  const searchResults = searchQuery.trim().length > 0 
    ? products?.filter(product => 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) // Limit to 5 results
    : [];

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Transparent -> solid on scroll
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleProductClick = (slug: string | undefined) => {
    if (!slug) return;
    router.push(`/products/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-colors duration-300 ${isScrolled ? "border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80" : "bg-transparent border-0"}`}>
        {/* Top mini-bar */}
        <div className={`w-full bg-slate-900 text-white text-sm leading-6 ${isScrolled ? "" : "opacity-95"}`}>
          <div className="container mx-auto px-4 py-1.5 flex items-center justify-center">
            <span className="truncate text-xs">
              🚚 Free islandwide delivery on orders above Rs. 10,000 &nbsp;|&nbsp; 💬 WhatsApp Support: {siteConfig.contact.phone}
            </span>
          </div>
        </div>

        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                {siteConfig.name}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-slate-700 hover:text-violet-600 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Categories Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <button className="text-sm font-medium text-slate-700 hover:text-violet-600 transition-colors flex items-center gap-1">
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isCategoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-xl py-2 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="/products"
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      All Products
                    </Link>
                    <div className="border-t border-slate-200 my-2"></div>
                    {categories?.map((category) => (
                      <Link
                        key={category._id}
                        href={`/products?category=${category._id}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Toggle - Desktop & Mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hover:bg-violet-50"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={openCart}
                className="relative hover:bg-violet-50"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs text-white font-semibold">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>

              {/* User Account */}
              <Button variant="ghost" size="icon" asChild className="hidden md:flex hover:bg-violet-50">
                <Link href="/account">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Bar (Desktop - Expandable) */}
          {isSearchOpen && (
            <div ref={searchRef} className="hidden md:block border-t p-4 bg-white animate-fade-in">
              <div className="max-w-2xl mx-auto flex items-start gap-2">
                <form onSubmit={handleSearch} className="flex-1 relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                    <Input
                      type="search"
                      placeholder="Search for products..."
                      className="pl-10 pr-4"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults && searchResults.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => handleProductClick(product.slug)}
                          className="w-full p-3 hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                        >
                          {product.images && product.images[0] && (
                            <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">
                              {product.title}
                            </p>
                            <p className="text-violet-600 font-semibold text-sm mt-0.5">
                              {product.hasVariants && product.variants && product.variants.length > 0
                                ? `${formatPrice(Math.min(...product.variants.map(v => v.price)))} - ${formatPrice(Math.max(...product.variants.map(v => v.price)))}`
                                : formatPrice(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No Results Message */}
                  {searchQuery.trim().length > 0 && searchResults && searchResults.length === 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-50">
                      <p className="text-gray-500 text-sm text-center">No products found</p>
                    </div>
                  )}
                </form>

                {/* Close Button - Outside */}
                <Button
                  type="button"
                  onClick={handleCloseSearch}
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Search Bar (Mobile - Full Screen Overlay) */}
          {isSearchOpen && (
            <div ref={searchRef} className="md:hidden fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200">
              <div className="bg-white h-full">
                <div className="p-4 border-b flex items-center gap-2">
                  <form onSubmit={handleSearch} className="flex-1 relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                      <Input
                        type="search"
                        placeholder="Search for products..."
                        className="pl-10 pr-4"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </form>
                  
                  {/* Close Button */}
                  <Button
                    type="button"
                    onClick={handleCloseSearch}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Search Results */}
                <div className="overflow-y-auto h-[calc(100%-80px)]">
                  {searchResults && searchResults.length > 0 && (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((product) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() => handleProductClick(product.slug)}
                          className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          {product.images && product.images[0] && (
                            <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 text-left">
                            <p className="font-medium text-gray-900 text-sm line-clamp-2">
                              {product.title}
                            </p>
                            <p className="text-violet-600 font-semibold text-base mt-1">
                              {product.hasVariants && product.variants && product.variants.length > 0
                                ? `${formatPrice(Math.min(...product.variants.map(v => v.price)))} - ${formatPrice(Math.max(...product.variants.map(v => v.price)))}`
                                : formatPrice(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No Results Message */}
                  {searchQuery.trim().length > 0 && searchResults && searchResults.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">No products found</p>
                      <p className="text-gray-400 text-sm mt-2">Try searching with different keywords</p>
                    </div>
                  )}

                  {/* Search Suggestions */}
                  {searchQuery.trim().length === 0 && (
                    <div className="p-4">
                      <p className="text-gray-500 text-sm">Start typing to search for products...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
        categories={categories}
      />

      {/* Cart Sheet */}
      <CartSheet />
    </>
  );
}
