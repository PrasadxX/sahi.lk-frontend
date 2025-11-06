"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Trash2, ArrowLeft, Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, removeItem, getSubtotal, deliveryFee, getTotal, fetchDeliveryFee } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [bankSlipFile, setBankSlipFile] = useState<File | null>(null);
  const [bankSlipPreview, setBankSlipPreview] = useState<string | null>(null);
  const [isUploadingSlip, setIsUploadingSlip] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Fetch delivery fee on mount
  useEffect(() => {
    fetchDeliveryFee();
  }, [fetchDeliveryFee]);

  const subtotal = getSubtotal();
  const total = getTotal();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 20MB",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or PDF file",
      });
      return;
    }

    setBankSlipFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBankSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBankSlipPreview(null);
    }
  };

  const removeBankSlip = () => {
    setBankSlipFile(null);
    setBankSlipPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate bank transfer requires slip
    if (paymentMethod === 'bank_transfer' && !bankSlipFile) {
      toast({
        title: "Bank slip required",
        description: "Please upload your bank transfer slip",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let bankSlipUrl = '';

      // Upload bank slip if payment method is bank transfer
      if (paymentMethod === 'bank_transfer' && bankSlipFile) {
        setIsUploadingSlip(true);
        setUploadProgress(0);
        
        const slipFormData = new FormData();
        slipFormData.append('bankSlip', bankSlipFile);

        // Simulate upload progress (since fetch doesn't support progress tracking natively)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const uploadResponse = await fetch('/api/upload-bank-slip', {
          method: 'POST',
          body: slipFormData,
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload bank slip');
        }

        const uploadData = await uploadResponse.json();
        bankSlipUrl = uploadData.url;
        setIsUploadingSlip(false);
      }

      // Generate unique order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Create order data
      const orderData = {
        orderId,
        ...formData,
        items: items.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        deliveryFee,
        total,
        paymentMethod,
        bankSlipUrl,
        orderDate: new Date().toISOString(),
      };

      console.log('Creating order:', orderId);

      // Send order to API
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderResult = await orderResponse.json();
      console.log('Order created successfully:', orderResult);

      // Store order in session storage for confirmation page (including status)
      const orderDataWithStatus = {
        ...orderData,
        status: orderResult.order?.status || (paymentMethod === 'bank_transfer' ? 'pending_verification' : 'pending'),
        paid: false,
      };
      sessionStorage.setItem('lastOrder', JSON.stringify(orderDataWithStatus));

      toast({
        title: "Order placed successfully!",
        description: "Redirecting to confirmation page...",
      });

      clearCart();
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploadingSlip(false);
      setUploadProgress(0);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-gray-600">Add some products to get started</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <Input
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <Input
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+94 71 234 5678"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Address *
                    </label>
                    <Input
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        City *
                      </label>
                      <Input
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Colombo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Postal Code *
                      </label>
                      <Input
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="00100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Order Notes (Optional)
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special instructions for your order..."
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'cod' | 'bank_transfer')}>
                  {/* Cash on Delivery */}
                  <Card className={`cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-violet-600 border-2 bg-violet-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start space-x-3 p-4">
                      <RadioGroupItem value="cod" id="cod" className="mt-1" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base">Cash on Delivery</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Pay with cash when your order is delivered
                        </div>
                      </Label>
                    </div>
                  </Card>

                  {/* Bank Transfer */}
                  <Card className={`cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-violet-600 border-2 bg-violet-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start space-x-3 p-4">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" className="mt-1" />
                      <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                        <div className="font-semibold text-base">Bank Transfer</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Transfer payment and upload your bank slip
                        </div>
                      </Label>
                    </div>

                    {/* Bank Details & Upload - Show when selected */}
                    {paymentMethod === 'bank_transfer' && (
                      <div className="px-4 pb-4 pt-2 space-y-4 border-t border-gray-200 mt-2">
                        {/* Bank Details */}
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                          <h3 className="font-semibold text-base mb-3">Bank Account Details</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">Bank:</div>
                            <div className="font-medium">Commercial Bank</div>
                            <div className="text-gray-600">Account Name:</div>
                            <div className="font-medium">Sahi.LK (Pvt) Ltd</div>
                            <div className="text-gray-600">Account Number:</div>
                            <div className="font-medium">1234567890</div>
                            <div className="text-gray-600">Branch:</div>
                            <div className="font-medium">Colombo City</div>
                          </div>
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs">
                            <strong>Note:</strong> Please include your order reference in the transfer description
                          </div>
                        </div>

                        {/* Upload Bank Slip */}
                        <div>
                          <Label className="block text-sm font-medium mb-2">
                            Upload Bank Slip * <span className="text-gray-500 font-normal">(Image or PDF, max 20MB)</span>
                          </Label>
                          
                          {!bankSlipFile ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-violet-400 transition-colors">
                              <input
                                type="file"
                                id="bankSlip"
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Label htmlFor="bankSlip" className="cursor-pointer">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                <div className="text-sm font-medium text-gray-700 mb-1">
                                  Click to upload bank slip
                                </div>
                                <div className="text-xs text-gray-500">
                                  JPEG, PNG or PDF (max 20MB)
                                </div>
                              </Label>
                            </div>
                          ) : (
                            <div className="border border-gray-300 rounded-lg p-4">
                              <div className="flex items-start gap-4">
                                {/* Preview */}
                                <div className="flex-shrink-0">
                                  {bankSlipPreview ? (
                                    <img 
                                      src={bankSlipPreview} 
                                      alt="Bank slip preview" 
                                      className="w-24 h-24 object-cover rounded border"
                                    />
                                  ) : (
                                    <div className="w-24 h-24 bg-gray-100 rounded border flex items-center justify-center">
                                      <FileText className="h-10 w-10 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                
                                {/* File Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{bankSlipFile.name}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {(bankSlipFile.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                  <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                    Ready to upload
                                  </div>
                                </div>

                                {/* Remove Button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeBankSlip}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                </RadioGroup>
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                {/* Upload Progress */}
                {isUploadingSlip && (
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-violet-700">
                        Uploading bank slip...
                      </span>
                      <span className="text-sm font-bold text-violet-700">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-violet-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-violet-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-violet-600 mt-2">
                      Please wait while we upload your bank slip...
                    </p>
                  </div>
                )}
                
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  disabled={isSubmitting || isUploadingSlip}
                >
                  {isUploadingSlip 
                    ? `Uploading... ${uploadProgress}%` 
                    : isSubmitting 
                    ? "Processing order..." 
                    : "Place Order"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => {
                  const itemKey = item.variantId ? `${item.productId}-${item.variantId}` : item.productId;
                  return (
                    <div key={itemKey} className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-violet-600">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-violet-700">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
