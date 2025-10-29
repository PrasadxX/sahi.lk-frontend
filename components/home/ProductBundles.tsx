"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, TrendingDown } from "lucide-react";

const bundles = [
  {
    title: "Work From Home Starter Pack",
    description: "Everything you need for a productive home office setup",
    items: ["Laptop Stand", "Wireless Mouse", "Keyboard", "Webcam"],
    originalPrice: 25000,
    bundlePrice: 19999,
    savings: 5001,
    icon: "💼",
    gradient: "from-blue-500 to-cyan-500",
    href: "/bundles/work-from-home",
  },
  {
    title: "Pro Gaming Setup Under Rs.150,000",
    description: "Complete gaming rig with peripherals for ultimate performance",
    items: ["Gaming Mouse", "Mechanical Keyboard", "Headset", "Mouse Pad"],
    originalPrice: 180000,
    bundlePrice: 149999,
    savings: 30001,
    icon: "🎮",
    gradient: "from-purple-500 to-pink-500",
    href: "/bundles/gaming-setup",
  },
  {
    title: "Creator's Essentials Kit",
    description: "Professional tools for content creators and designers",
    items: ["Graphics Tablet", "Studio Mic", "Ring Light", "Boom Arm"],
    originalPrice: 95000,
    bundlePrice: 79999,
    savings: 15001,
    icon: "🎨",
    gradient: "from-orange-500 to-red-500",
    href: "/bundles/creator-kit",
  },
];

export function ProductBundles() {
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
          <Badge className="mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0">
            <Package className="mr-1 h-4 w-4" />
            Bundle Deals
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-600 to-teal-600">
            💎 Smart Product Bundles
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Save more with our curated product bundles designed for every need
          </p>
        </motion.div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle, index) => (
            <motion.div
              key={bundle.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group h-full border-2 border-slate-200 hover:border-emerald-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Header with Icon */}
                  <div className={`relative h-40 bg-gradient-to-br ${bundle.gradient} flex items-center justify-center overflow-hidden`}>
                    <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                      {bundle.icon}
                    </div>
                    
                    {/* Savings Badge */}
                    <Badge className="absolute top-3 right-3 bg-white text-emerald-600 border-0 flex items-center gap-1 px-3 py-1">
                      <TrendingDown className="h-3 w-3" />
                      Save Rs. {bundle.savings.toLocaleString()}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {bundle.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      {bundle.description}
                    </p>

                    {/* Included Items */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-700 mb-2">Includes:</p>
                      <div className="flex flex-wrap gap-2">
                        {bundle.items.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs border-slate-300">
                            ✓ {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-400 line-through">
                          Rs. {bundle.originalPrice.toLocaleString()}
                        </span>
                        <Badge className="bg-red-100 text-red-600 border-0 text-xs">
                          -{Math.round((bundle.savings / bundle.originalPrice) * 100)}%
                        </Badge>
                      </div>
                      <div className="text-3xl font-bold text-emerald-600">
                        Rs. {bundle.bundlePrice.toLocaleString()}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                      <Link href={bundle.href}>
                        View Bundle
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200"
        >
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              💡 Custom Bundles Available
            </h3>
            <p className="text-slate-600 mb-4">
              Need a specific combination? Contact us to create your perfect bundle!
            </p>
            <Button asChild variant="outline" className="border-emerald-300 hover:bg-emerald-50">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
