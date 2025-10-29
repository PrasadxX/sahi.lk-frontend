"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones, Smartphone, Watch, Sparkles } from "lucide-react";

const categories = [
  {
    name: "Wireless Earbuds",
    href: "/products?category=earbuds",
    icon: Headphones,
    color: "from-blue-500 to-cyan-500",
    description: "Premium audio experience",
  },
  {
    name: "Xiaomi Accessories",
    href: "/products?category=xiaomi",
    icon: Smartphone,
    color: "from-orange-500 to-red-500",
    description: "Authentic Xiaomi products",
  },
  {
    name: "Mobile Gadgets",
    href: "/products?category=gadgets",
    icon: Watch,
    color: "from-purple-500 to-pink-500",
    description: "Latest tech gadgets",
  },
  {
    name: "New Arrivals",
    href: "/products?category=new",
    icon: Sparkles,
    color: "from-green-500 to-emerald-500",
    description: "Fresh products added",
  },
];

export function CategoryShowcase() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our curated collection of authentic electronics and gadgets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <CardContent className="p-6">
                    <div className="relative">
                      {/* Gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity rounded-lg`}
                      />
                      
                      {/* Content */}
                      <div className="relative space-y-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                          <category.icon className="h-8 w-8 text-white" />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center text-sm font-medium text-primary">
                          Shop Now
                          <svg
                            className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
