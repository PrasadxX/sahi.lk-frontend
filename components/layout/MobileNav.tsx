"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: Array<{ name: string; href: string }>;
  categories?: Array<{ _id: string; name: string }>;
}

export function MobileNav({ isOpen, onClose, navigation, categories }: MobileNavProps) {
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 z-50 h-full w-4/5 max-w-sm bg-white shadow-xl md:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                  Menu
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Search */}
              <div className="border-b p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 pr-4"
                  />
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  
                  {/* Categories Accordion */}
                  {categories && categories.length > 0 && (
                    <li>
                      <button
                        onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                        className="w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                      >
                        Categories
                        {isCategoriesExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      
                      {/* Categories List */}
                      <AnimatePresence>
                        {isCategoriesExpanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 mt-2 space-y-1 overflow-hidden"
                          >
                            <li>
                              <Link
                                href="/products"
                                onClick={onClose}
                                className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                              >
                                All Products
                              </Link>
                            </li>
                            {categories.map((category) => (
                              <li key={category._id}>
                                <Link
                                  href={`/products?category=${category._id}`}
                                  onClick={onClose}
                                  className="block rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                                >
                                  {category.name}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  )}
                  
                  <li className="pt-2 border-t">
                    <Link
                      href="/account"
                      onClick={onClose}
                      className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                    >
                      My Account
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
