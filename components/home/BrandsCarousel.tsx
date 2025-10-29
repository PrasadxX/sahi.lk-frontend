"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

const brands = [
  { name: "ASUS", logo: "🖥️", href: "/products?brand=asus" },
  { name: "Lenovo", logo: "💻", href: "/products?brand=lenovo" },
  { name: "Logitech", logo: "🖱️", href: "/products?brand=logitech" },
  { name: "Anker", logo: "🔌", href: "/products?brand=anker" },
  { name: "Samsung", logo: "📱", href: "/products?brand=samsung" },
  { name: "Baseus", logo: "🔋", href: "/products?brand=baseus" },
  { name: "HP", logo: "🖨️", href: "/products?brand=hp" },
  { name: "Apple", logo: "🍎", href: "/products?brand=apple" },
  { name: "MSI", logo: "🎮", href: "/products?brand=msi" },
  { name: "Razer", logo: "🐍", href: "/products?brand=razer" },
];

export function BrandsCarousel() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-0">
            <Award className="mr-1 h-4 w-4" />
            Trusted Partners
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-violet-600 to-indigo-600">
            Shop by Brand
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Explore authentic products from the world's leading tech brands
          </p>
        </motion.div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={brand.href}>
                <Card className="group h-32 flex flex-col items-center justify-center p-6 border-slate-200 hover:border-violet-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {brand.logo}
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">
                    {brand.name}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className="mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity border-violet-300 text-violet-600"
                  >
                    Official Partner
                  </Badge>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Infinite Scroll Animation (Alternative Display) */}
        <div className="mt-12 overflow-hidden">
          <motion.div
            className="flex gap-8"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-slate-50 rounded-lg grayscale hover:grayscale-0 transition-all"
              >
                <span className="text-3xl">{brand.logo}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
