import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { sendOrderConfirmationEmail } from "@/lib/brevo";

// Increase function timeout for Vercel (max 60s on Pro plan, 10s on Hobby)
export const maxDuration = 10; // seconds
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const orderData = await request.json();

    // Validate required fields
    const requiredFields = ['orderId', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode', 'items', 'subtotal', 'deliveryFee', 'total', 'paymentMethod'];
    
    for (const field of requiredFields) {
      if (!orderData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate payment method
    if (!['cod', 'bank_transfer'].includes(orderData.paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Validate bank slip for bank transfer
    if (orderData.paymentMethod === 'bank_transfer' && !orderData.bankSlipUrl) {
      return NextResponse.json(
        { error: 'Bank slip URL is required for bank transfer payments' },
        { status: 400 }
      );
    }

    // Set initial status based on payment method
    let initialStatus = 'pending';
    if (orderData.paymentMethod === 'bank_transfer') {
      initialStatus = 'pending_verification';
    }

    // Transform items to products format for database
    const products = orderData.items.map((item: any) => ({
      _id: item.productId || item._id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    }));

    // Create order object
    const newOrder = new Order({
      orderId: orderData.orderId,
      products: products,
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      city: orderData.city,
      postalCode: orderData.postalCode,
      province: orderData.province || '',
      district: orderData.district || '',
      notes: orderData.notes || '',
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      bankSlipUrl: orderData.bankSlipUrl || '',
      status: initialStatus,
      paid: false,
      orderDate: new Date(orderData.orderDate || Date.now()),
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    console.log(`Order created successfully: ${savedOrder.orderId}`);

    // Send order confirmation email asynchronously (fire and forget)
    // Don't await it to avoid blocking the response
    console.log(`Attempting to send order confirmation email to ${savedOrder.email}`);
    
    // Use Promise.resolve() to ensure it runs in background without blocking
    Promise.resolve().then(async () => {
      try {
        const emailSent = await sendOrderConfirmationEmail({
          orderId: savedOrder.orderId,
          customerName: `${savedOrder.firstName} ${savedOrder.lastName}`,
          customerEmail: savedOrder.email,
          items: savedOrder.products.map((p: any) => ({
            title: p.title,
            quantity: p.quantity,
            price: p.price,
          })),
          subtotal: savedOrder.subtotal,
          deliveryFee: savedOrder.deliveryFee,
          total: savedOrder.total,
          paymentMethod: savedOrder.paymentMethod,
          address: savedOrder.address,
          city: savedOrder.city,
          phone: savedOrder.phone,
        });
        
        if (emailSent) {
          console.log(`✓ Order confirmation email sent successfully to ${savedOrder.email}`);
        } else {
          console.error(`✗ Failed to send order confirmation email to ${savedOrder.email}`);
        }
      } catch (error) {
        console.error('Failed to send order confirmation email:', error);
      }
    });

    return NextResponse.json({
      success: true,
      orderId: savedOrder.orderId,
      status: savedOrder.status,
      message: 'Order created successfully',
      order: {
        _id: savedOrder._id,
        orderId: savedOrder.orderId,
        status: savedOrder.status,
        total: savedOrder.total,
        paymentMethod: savedOrder.paymentMethod,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating order:', error);
    
    // Handle duplicate order ID
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Order ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');
    const id = searchParams.get('id'); // MongoDB _id

    if (orderId) {
      // Find specific order by orderId
      const order = await Order.findOne({ orderId });
      
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        order
      });
    }

    if (id) {
      // Find specific order by MongoDB _id
      const order = await Order.findById(id);
      
      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        order
      });
    }

    if (email) {
      // Find orders by email
      const orders = await Order.find({ email }).sort({ createdAt: -1 });
      
      return NextResponse.json({
        success: true,
        orders
      });
    }

    // Return error if no query params
    return NextResponse.json(
      { error: 'Please provide orderId, id, or email parameter' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch order',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
