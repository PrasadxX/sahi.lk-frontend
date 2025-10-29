"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ThumbsUp } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "Dinesh K.",
    location: "Colombo",
    rating: 5,
    review: "Excellent delivery speed and genuine quality — bought a laptop stand & it's perfect! Highly recommend Sahi.LK for authentic products.",
    product: "Laptop Stand",
    verified: true,
    image: "👨‍💼",
  },
  {
    name: "Savini P.",
    location: "Kandy",
    rating: 5,
    review: "Amazing customer service! I ordered wireless earbuds and they arrived within 2 days. The quality is top-notch and exactly as described.",
    product: "Wireless Earbuds",
    verified: true,
    image: "👩‍💼",
  },
  {
    name: "Kasun M.",
    location: "Galle",
    rating: 5,
    review: "Best online tech store in Sri Lanka! Competitive prices, genuine products, and fast island-wide delivery. Will definitely order again.",
    product: "Gaming Mouse",
    verified: true,
    image: "👨‍💻",
  },
  {
    name: "Nisha R.",
    location: "Negombo",
    rating: 5,
    review: "Very satisfied with my purchase. The mechanical keyboard I ordered works perfectly and the packaging was excellent. Great experience overall!",
    product: "Mechanical Keyboard",
    verified: true,
    image: "👩‍🎓",
  },
];

export function CustomerReviews() {
  return (
    <section className="py-16 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0">
            <ThumbsUp className="mr-1 h-4 w-4" />
            Customer Reviews
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-violet-600 to-purple-600">
            What Our Customers Say
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-6">
            Join thousands of satisfied customers across Sri Lanka
          </p>

          {/* Trust Badges */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">4.9 / 5.0</span>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">1000+</span> Happy Customers
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <Image src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" width={60} height={20} className="h-5 w-auto" />
              <span className="text-sm text-slate-600">Verified Reviews</span>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-violet-200 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-violet-200 mb-4 group-hover:text-violet-300 transition-colors" />

                  {/* Stars */}
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                    "{review.review}"
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <div className="text-3xl">
                      {review.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs border-green-300 text-green-600">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{review.location}</p>
                      <p className="text-xs text-slate-400 italic mt-1">Purchased: {review.product}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-slate-600 mb-4">Trusted by leading review platforms</p>
          <div className="flex items-center justify-center gap-8 grayscale opacity-60">
            <span className="text-2xl">⭐</span>
            <span className="text-2xl">📱</span>
            <span className="text-2xl">✅</span>
            <span className="text-2xl">🏆</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
