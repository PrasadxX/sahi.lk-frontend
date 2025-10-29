"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });

    setEmail("");
    setIsLoading(false);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-white/20 text-white border-0">
              <Mail className="mr-1 h-4 w-4" />
              Stay Connected
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get Exclusive Tech Drops & Offers
            </h2>
            <p className="text-violet-100 text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss out on the latest gadgets, deals, and tech insights delivered straight to your inbox.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-white text-violet-600 hover:bg-white/90 font-semibold px-8"
              >
                {isLoading ? "Subscribing..." : (
                  <>
                    Subscribe
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
