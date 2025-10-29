"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Heart, 
  Truck, 
  Shield, 
  ArrowLeft, 
  Share2,
  Check,
  Star,
  ChevronRight
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

type TabType = "description" | "specifications" | "reviews" | "videos";

// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    let videoId = "";
    
    if (urlObj.hostname.includes("youtube.com")) {
      videoId = urlObj.searchParams.get("v") || "";
    } else if (urlObj.hostname.includes("youtu.be")) {
      videoId = urlObj.pathname.slice(1);
    }
    
    const timestamp = urlObj.searchParams.get("t");
    const start = timestamp ? `?start=${timestamp.replace("s", "")}` : "";
    
    return `https://www.youtube.com/embed/${videoId}${start}`;
  } catch {
    return "";
  }
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading } = useProduct(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});
  const { addItem } = useCartStore();

  // Get current price and stock based on variant selection
  const getCurrentPrice = () => {
    if (product?.hasVariants && product.variants) {
      if (product.variantSelectionStyle === 'quantity') {
        // Calculate total from all selected quantities
        let total = 0;
        product.variants.forEach(variant => {
          const qty = variantQuantities[variant._id] || 0;
          if (qty > 0) {
            total += variant.price * qty;
          }
        });
        return total || product.price; // Show base price if nothing selected
      } else if (selectedVariant) {
        // Dropdown style - show selected variant price
        const variant = product.variants.find(v => v._id === selectedVariant);
        return variant?.price || product.price;
      }
    }
    return product?.price || 0;
  };

  const getCurrentStock = () => {
    if (product?.hasVariants && selectedVariant) {
      const variant = product.variants?.find(v => v._id === selectedVariant);
      return variant?.stock || 0;
    }
    return product?.stock || 0;
  };

  const isInStock = () => {
    if (product?.hasVariants) {
      if (product.variantSelectionStyle === 'quantity') {
        return product.variants?.some(v => v.stock > 0) || false;
      }
      return selectedVariant ? getCurrentStock() > 0 : false;
    }
    return product?.inStock || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.hasVariants) {
      if (product.variantSelectionStyle === 'quantity') {
        // Add all variants with quantities > 0
        let addedCount = 0;
        product.variants?.forEach(variant => {
          const qty = variantQuantities[variant._id] || 0;
          if (qty > 0) {
            addItem({
              productId: product._id,
              variantId: variant._id,
              title: `${product.title} - ${variant.name}`,
              price: variant.price,
              image: product.images[0],
              slug: product.slug,
              quantity: qty,
            });
            addedCount += qty;
          }
        });
        
        if (addedCount > 0) {
          toast({
            title: "Added to cart",
            description: `${addedCount} item(s) added to your cart.`,
          });
        } else {
          toast({
            title: "No items selected",
            description: "Please select quantity for at least one variant.",
          });
        }
        return;
      } else {
        // Dropdown style - require variant selection
        if (!selectedVariant) {
          toast({
            title: "Please select a variant",
            description: "Choose a variant before adding to cart.",
          });
          return;
        }
        
        const variant = product.variants?.find(v => v._id === selectedVariant);
        addItem({
          productId: product._id,
          variantId: variant?._id,
          title: `${product.title} - ${variant?.name}`,
          price: variant?.price || product.price,
          image: product.images[0],
          slug: product.slug,
        });
      }
    } else {
      // No variants
      addItem({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
      });
    }

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-violet-600 transition-colors">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          {product.category && (
            <>
              <Link 
                href={`/products?category=${product.category._id}`}
                className="hover:text-violet-600 transition-colors"
              >
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-slate-900 font-medium line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image - Large */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white shadow-lg border border-slate-200">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-contain p-6"
                priority
              />
              {product.featured && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-600 border-none">
                  Featured
                </Badge>
              )}
              <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors">
                <Share2 className="h-5 w-5 text-slate-700" />
              </button>
            </div>

            {/* Thumbnails - Below Main Image */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-violet-600 shadow-md ring-2 ring-violet-200"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              {product.category && (
                <Link 
                  href={`/products?category=${product.category._id}`}
                  className="text-sm text-violet-600 uppercase tracking-wide font-semibold hover:text-violet-700 transition-colors"
                >
                  {product.category.name}
                </Link>
              )}
              {isInStock() ? (
                <Badge className="bg-green-500 hover:bg-green-600 gap-1">
                  <Check className="h-3 w-3" />
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating (placeholder) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-slate-600">(0 reviews)</span>
            </div>

            {/* Price */}
            <motion.div 
              key={`${selectedVariant}-${JSON.stringify(variantQuantities)}`}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl p-6 border border-violet-100"
            >
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                {formatPrice(getCurrentPrice())}
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {product.hasVariants && product.variantSelectionStyle === 'quantity' && 
                 Object.values(variantQuantities).some(q => q > 0) ? (
                  <span className="text-violet-600 font-medium">Total for selected items</span>
                ) : product.hasVariants && selectedVariant ? (
                  <span className="text-violet-600 font-medium">Selected variant price</span>
                ) : (
                  'Inclusive of all taxes'
                )}
              </p>
            </motion.div>

            {/* Variants Selection */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <Card className="p-5 bg-white border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">
                  {product.variantSelectionStyle === 'quantity' ? 'Select Quantities' : 'Select Option'}
                </h3>
                
                {product.variantSelectionStyle === 'quantity' ? (
                  // Quantity style - show all variants with quantity inputs
                  <div className="space-y-3">
                    {product.variants.map((variant) => (
                      <div key={variant._id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-violet-300 transition-colors">
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{variant.name}</div>
                          <div className="text-sm text-violet-600 font-semibold">{formatPrice(variant.price)}</div>
                          <div className="text-xs text-slate-500">
                            {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            disabled={variant.stock === 0 || (variantQuantities[variant._id] || 0) === 0}
                            onClick={() => {
                              setVariantQuantities(prev => ({
                                ...prev,
                                [variant._id]: Math.max(0, (prev[variant._id] || 0) - 1)
                              }));
                            }}
                          >
                            -
                          </Button>
                          <input
                            type="number"
                            min="0"
                            max={variant.stock}
                            value={variantQuantities[variant._id] || 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setVariantQuantities(prev => ({
                                ...prev,
                                [variant._id]: Math.min(variant.stock, Math.max(0, val))
                              }));
                            }}
                            className="w-16 text-center border border-slate-300 rounded px-2 py-1 text-sm"
                            disabled={variant.stock === 0}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            disabled={variant.stock === 0 || (variantQuantities[variant._id] || 0) >= variant.stock}
                            onClick={() => {
                              setVariantQuantities(prev => ({
                                ...prev,
                                [variant._id]: Math.min(variant.stock, (prev[variant._id] || 0) + 1)
                              }));
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Dropdown style - select one variant
                  <div className="space-y-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant._id)}
                        disabled={variant.stock === 0}
                        className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                          selectedVariant === variant._id
                            ? 'border-violet-600 bg-violet-50'
                            : 'border-slate-200 hover:border-slate-300'
                        } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedVariant === variant._id
                              ? 'border-violet-600 bg-violet-600'
                              : 'border-slate-300'
                          }`}>
                            {selectedVariant === variant._id && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-slate-900">{variant.name}</div>
                            {variant.stock === 0 && (
                              <div className="text-xs text-red-600">Out of stock</div>
                            )}
                          </div>
                        </div>
                        <div className="font-semibold text-violet-600">
                          {formatPrice(variant.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Key Features */}
            
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50/50">
                  <div className="p-2 rounded-lg bg-violet-100">
                    <Truck className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Fast Delivery</div>
                    <div className="text-xs text-slate-600">3-5 business days</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50/50">
                  <div className="p-2 rounded-lg bg-indigo-100">
                    <Shield className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Warranty</div>
                    <div className="text-xs text-slate-600">Full protection</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50/50">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Authentic</div>
                    <div className="text-xs text-slate-600">100% genuine</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/50">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Secure Payment</div>
                    <div className="text-xs text-slate-600">Safe & protected</div>
                  </div>
                </div>
              </div>
            

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
                disabled={!isInStock()}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-6 w-6" />
                {product.hasVariants && product.variantSelectionStyle === 'quantity' ? 'Add Selected to Cart' : 'Add to Cart'}
              </Button>

              
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Card className="overflow-hidden border-slate-200">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === "description"
                    ? "text-violet-600 bg-violet-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Description
                {activeTab === "description" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === "specifications"
                    ? "text-violet-600 bg-violet-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Specifications
                {activeTab === "specifications" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                )}
              </button>
              {product.videos && product.videos.length > 0 && (
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === "videos"
                      ? "text-violet-600 bg-violet-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Videos ({product.videos.length})
                  {activeTab === "videos" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                  )}
                </button>
              )}
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors relative ${
                  activeTab === "reviews"
                    ? "text-violet-600 bg-violet-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                Reviews (0)
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-slate-700 leading-relaxed text-base">
                    {product.description || "No description available for this product."}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  {product.properties && Object.keys(product.properties).length > 0 ? (
                    <dl className="divide-y divide-slate-200">
                      {Object.entries(product.properties).map(([key, value]) => (
                        <div key={key} className="py-4 grid grid-cols-3 gap-4">
                          <dt className="font-semibold text-slate-900">{key}</dt>
                          <dd className="col-span-2 text-slate-700">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-slate-600">No specifications available.</p>
                  )}
                </div>
              )}

              {activeTab === "videos" && (
                <div>
                  {product.videos && product.videos.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {product.videos.map((video, index) => {
                          const embedUrl = getYouTubeEmbedUrl(video.url);
                          if (!embedUrl) return null;
                          
                          return (
                            <div key={video._id} className="space-y-3">
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100 shadow-md">
                                <iframe
                                  src={embedUrl}
                                  title={video.title}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="absolute inset-0 w-full h-full"
                                />
                              </div>
                              <div className="space-y-1">
                                <h4 className="font-semibold text-slate-900 line-clamp-2">
                                  {video.title}
                                </h4>
                                <a 
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-violet-600 hover:text-violet-700 inline-flex items-center gap-1"
                                >
                                  Watch on YouTube
                                  <ChevronRight className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600">No videos available for this product.</p>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No reviews yet</h3>
                  <p className="text-slate-600 mb-6">Be the first to review this product!</p>
                  <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
