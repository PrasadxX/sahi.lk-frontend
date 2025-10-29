"use client";

import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CartSheet() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, itemCount } = useCartStore();
  
  // Calculate total from items directly to ensure accuracy
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                {itemCount > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                    {itemCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add some products to get started!
                  </p>
                  <Button onClick={closeCart} asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemKey = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
                    return (
                      <div key={itemKey} className="flex gap-4 rounded-lg border p-3">
                        {/* Image */}
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex flex-1 flex-col">
                          <Link
                            href={`/products/${item.slug || item.productId}`}
                            onClick={closeCart}
                            className="text-sm font-medium hover:text-primary line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          
                          <div className="mt-1 text-xs text-slate-500">
                            {formatPrice(item.price)} each
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="text-sm font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="mt-2 text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    Proceed to Checkout
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                  asChild
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
