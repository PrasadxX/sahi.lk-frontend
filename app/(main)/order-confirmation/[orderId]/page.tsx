"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { 
  CheckCircle2, 
  Home, 
  Printer, 
  Package, 
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  Truck,
  XCircle
} from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get status configuration
  const getStatusConfig = (status: string) => {
    const statusConfigs: Record<string, { label: string; color: string; bgColor: string; icon: any; description: string }> = {
      pending: {
        label: 'Pending',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100 border-yellow-300',
        icon: Clock,
        description: 'Your order is being processed'
      },
      pending_verification: {
        label: 'Pending Verification',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100 border-blue-300',
        icon: AlertCircle,
        description: 'We are verifying your payment'
      },
      confirmed: {
        label: 'Confirmed',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-300',
        icon: CheckCircle,
        description: 'Your order has been confirmed'
      },
      processing: {
        label: 'Processing',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100 border-purple-300',
        icon: Package,
        description: 'Your order is being prepared'
      },
      shipped: {
        label: 'Shipped',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-100 border-indigo-300',
        icon: Truck,
        description: 'Your order is on the way'
      },
      delivered: {
        label: 'Delivered',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-300',
        icon: CheckCircle2,
        description: 'Your order has been delivered'
      },
      cancelled: {
        label: 'Cancelled',
        color: 'text-red-700',
        bgColor: 'bg-red-100 border-red-300',
        icon: XCircle,
        description: 'This order has been cancelled'
      }
    };

    return statusConfigs[status] || statusConfigs.pending;
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // First try to get order details from session storage
        const storedOrder = sessionStorage.getItem('lastOrder');
        if (storedOrder) {
          const order = JSON.parse(storedOrder);
          if (order.orderId === orderId) {
            setOrderDetails(order);
            setIsLoading(false);
            return;
          }
        }

        // If not in session storage, fetch from database
        console.log('Fetching order from database:', orderId);
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        
        if (!response.ok) {
          throw new Error('Order not found');
        }

        const data = await response.json();
        if (data.success && data.order) {
          // Transform database order to match UI format
          const transformedOrder = {
            orderId: data.order.orderId,
            firstName: data.order.firstName,
            lastName: data.order.lastName,
            email: data.order.email,
            phone: data.order.phone,
            address: data.order.address,
            city: data.order.city,
            postalCode: data.order.postalCode,
            notes: data.order.notes,
            items: data.order.products.map((p: any) => ({
              title: p.title,
              price: p.price,
              quantity: p.quantity,
            })),
            subtotal: data.order.subtotal,
            deliveryFee: data.order.deliveryFee,
            total: data.order.total,
            paymentMethod: data.order.paymentMethod,
            bankSlipUrl: data.order.bankSlipUrl,
            orderDate: data.order.orderDate || data.order.createdAt,
            status: data.order.status, // Include status
            paid: data.order.paid, // Include paid status
            trackingNumber: data.order.trackingNumber, // Include tracking number
          };
          setOrderDetails(transformedOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-violet-600 mb-4">
            <Package className="h-16 w-16 mx-auto animate-pulse" />
          </div>
          <h2 className="text-xl font-bold mb-2">Loading order details...</h2>
          <p className="text-gray-600">
            Please wait while we fetch your order information.
          </p>
        </Card>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Package className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-bold mb-2">Order not found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the details for this order.
          </p>
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 print:bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Success Header - Hide on print */}
        <div className="text-center mb-8 print:hidden">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. We've received your order.
          </p>
        </div>

        {/* Action Buttons - Hide on print */}
        <div className="flex gap-3 justify-center mb-8 print:hidden">
          <Button onClick={handlePrint} variant="outline" size="lg">
            <Printer className="mr-2 h-4 w-4" />
            Print Order
          </Button>
          <Button asChild size="lg" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Order Details Card */}
        <Card className="p-6 md:p-8 print:shadow-none print:border-2">
          {/* Print Header - Only visible on print */}
          <div className="hidden print:block text-center mb-6 pb-6 border-b">
            <h1 className="text-2xl font-bold mb-2">Sahi.LK</h1>
            <p className="text-sm text-gray-600">Order Confirmation</p>
          </div>

          {/* Order ID and Date */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6 mb-6 print:bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Order ID</div>
                <div className="text-2xl font-bold text-violet-700 font-mono">
                  #{orderId}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Order Date
                </div>
                <div className="text-lg font-semibold">
                  {new Date(orderDetails.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order Status */}
          {orderDetails.status && (() => {
            const statusConfig = getStatusConfig(orderDetails.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div className={`rounded-lg p-6 mb-8 border-2 ${statusConfig.bgColor}`}>
                <div className="flex items-start gap-4">
                  <div className={`${statusConfig.color} mt-1`}>
                    <StatusIcon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-xl font-bold ${statusConfig.color}`}>
                        {statusConfig.label}
                      </h3>
                      {orderDetails.paid && (
                        <Badge className="bg-green-600">
                          Paid
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {statusConfig.description}
                    </p>
                    
                    {/* Show tracking number if available and shipped */}
                    {orderDetails.trackingNumber && orderDetails.status === 'shipped' && (
                      <div className="bg-white/50 rounded p-3 mt-3">
                        <div className="text-xs text-gray-600 mb-1">Tracking Number</div>
                        <div className="font-mono font-semibold text-sm">
                          {orderDetails.trackingNumber}
                        </div>
                      </div>
                    )}

                    {/* Payment verification notice for bank transfers */}
                    {orderDetails.status === 'pending_verification' && orderDetails.paymentMethod === 'bank_transfer' && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                        <p className="text-xs text-blue-800">
                          <strong>Note:</strong> Our team is verifying your bank transfer. 
                          This usually takes 1-2 business hours. You'll receive an email once confirmed.
                        </p>
                      </div>
                    )}

                    {/* COD notice */}
                    {orderDetails.status === 'pending' && orderDetails.paymentMethod === 'cod' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-3">
                        <p className="text-xs text-yellow-800">
                          <strong>Cash on Delivery:</strong> Please have the exact amount ready when receiving your order.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-violet-600" />
              Delivery Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Customer Name</div>
                  <div className="font-medium">
                    {orderDetails.firstName} {orderDetails.lastName}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{orderDetails.phone}</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{orderDetails.email}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Delivery Address</div>
                    <div className="font-medium">
                      {orderDetails.address}<br />
                      {orderDetails.city}, {orderDetails.postalCode}
                    </div>
                  </div>
                </div>
                {orderDetails.notes && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-1">Order Notes</div>
                    <div className="text-sm bg-gray-50 p-3 rounded">
                      {orderDetails.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-violet-600" />
              Payment Information
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Payment Method</span>
                <Badge className={orderDetails.paymentMethod === 'bank_transfer' ? 'bg-blue-600' : 'bg-green-600'}>
                  {orderDetails.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}
                </Badge>
              </div>
              {orderDetails.bankSlipUrl && (
                <div className="mt-3 pt-3 border-t flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <a 
                    href={orderDetails.bankSlipUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-violet-600 hover:underline"
                  >
                    View Bank Transfer Slip
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-3">
              {orderDetails.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-gray-600">
                      {formatPrice(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <div className="space-y-3 max-w-sm ml-auto">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(orderDetails.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{formatPrice(orderDetails.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-3 border-t">
                <span>Total</span>
                <span className="text-violet-700">{formatPrice(orderDetails.total)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
            <p className="mb-2">
              You will receive an email confirmation shortly at <strong>{orderDetails.email}</strong>
            </p>
            <p>
              For any questions about your order, please contact us at support@sahi.lk
            </p>
          </div>
        </Card>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            @page {
              margin: 1cm;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
