"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";

const blogPosts = [
  {
    title: "5 Must-Have Laptop Accessories for 2025",
    excerpt: "Boost your productivity with these essential laptop accessories that every professional needs.",
    category: "Accessories",
    readTime: "5 min read",
    author: "Tech Team",
    date: "Oct 25, 2025",
    image: "💼",
    href: "/blog/laptop-accessories-2025",
  },
  {
    title: "How to Choose the Perfect Mechanical Keyboard",
    excerpt: "A comprehensive guide to selecting the right mechanical keyboard for your typing style and needs.",
    category: "Keyboards",
    readTime: "8 min read",
    author: "Tech Team",
    date: "Oct 20, 2025",
    image: "⌨️",
    href: "/blog/mechanical-keyboard-guide",
  },
  {
    title: "Top Tech Deals in Sri Lanka — October Edition",
    excerpt: "Discover the best tech deals available this month with our expert recommendations and price comparisons.",
    category: "Deals",
    readTime: "6 min read",
    author: "Tech Team",
    date: "Oct 15, 2025",
    image: "💰",
    href: "/blog/october-tech-deals",
  },
];

export function BlogHighlights() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
            <BookOpen className="mr-1 h-4 w-4" />
            Tech Insights
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-600 to-cyan-600">
            Latest from Our Blog
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Stay updated with the latest tech trends, reviews, and buying guides
          </p>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={post.href}>
                <Card className="group h-full hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-blue-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image Placeholder */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden">
                      <div className="text-7xl group-hover:scale-110 transition-transform duration-300">
                        {post.image}
                      </div>
                      <Badge className="absolute top-3 right-3 bg-white text-blue-600 border-0">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline" className="border-2 border-blue-300 hover:bg-blue-50">
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
