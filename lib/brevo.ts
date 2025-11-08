import { logFailedEmail } from './email-fallback';

/**
 * Brevo (formerly Sendinblue) Email Service
 * 
 * Setup Instructions:
 * 1. Sign up at https://www.brevo.com/
 * 2. Get your API key from Settings > SMTP & API > API Keys
 * 3. Add to .env.local: BREVO_API_KEY=your_api_key_here
 * 4. Verify your sender email in Brevo dashboard
 */

interface EmailParams {
  to: { email: string; name: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  address: string;
  city: string;
  phone: string;
  status?: string;
  trackingNumber?: string;
}

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@sahi.lk';
const SENDER_NAME = process.env.SENDER_NAME || 'Sahi.LK';

/**
 * Send email using Brevo API with retry logic
 * Optimized for Vercel serverless with shorter timeout
 */
export async function sendEmail(params: EmailParams, retries = 2): Promise<boolean> {
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY is not configured');
    return false;
  }

  if (!SENDER_EMAIL) {
    console.error('❌ SENDER_EMAIL is not configured');
    return false;
  }

  console.log(`📧 Preparing to send email to: ${params.to[0]?.email}`);
  console.log(`📧 Subject: ${params.subject}`);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📤 Sending email (attempt ${attempt}/${retries})...`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout for Vercel

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': BREVO_API_KEY,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          sender: { email: SENDER_EMAIL, name: SENDER_NAME },
          to: params.to,
          subject: params.subject,
          htmlContent: params.htmlContent,
          textContent: params.textContent,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Brevo API error:', error);
        
        // Don't retry on client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          console.error(`❌ Client error ${response.status}, not retrying`);
          return false;
        }
        
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(error)}`);
      }

      console.log('✅ Email sent successfully!');
      return true;
    } catch (error: any) {
      console.error(`❌ Error sending email (attempt ${attempt}/${retries}):`, error.message);
      
      // If this is the last attempt, log it for manual retry
      if (attempt === retries) {
        console.error('❌ All email sending attempts failed');
        
        // Log failed email for later retry
        logFailedEmail({
          timestamp: new Date().toISOString(),
          to: params.to[0]?.email || 'unknown',
          subject: params.subject,
          orderId: params.subject.match(/ORD-[A-Z0-9-]+/)?.[0] || 'unknown',
          error: error.message,
        });
        
        return false;
      }
      
      // Wait before retrying (shorter delay for Vercel)
      const delay = 1000; // Fixed 1 second delay
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return false;
}

/**
 * Format price in LKR
 */
function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Generate order confirmation email HTML
 */
function generateOrderConfirmationHTML(data: OrderEmailData): string {
  // Generate order tracking URL
  const orderTrackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sahi.lk'}/order-confirmation/${data.orderId}`;
  
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        ${item.title}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${formatPrice(item.price)}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${formatPrice(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                Order Confirmed! 🎉
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                Thank you for your order
              </p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
                Hi <strong>${data.customerName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                We've received your order and will process it shortly. You'll receive another email when your order is ${data.paymentMethod === 'bank_transfer' ? 'verified and' : ''} shipped.
              </p>

              <!-- Order Info Box -->
              <div style="background-color: #f9fafb; border-left: 4px solid #7c3aed; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; color: #374151; font-size: 14px;">
                  <strong>Order ID:</strong> <span style="color: #7c3aed; font-weight: 600;">${data.orderId}</span>
                </p>
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  <strong>Order Date:</strong> ${new Date().toLocaleDateString('en-LK', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <!-- Order Items -->
              <h2 style="margin: 30px 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">
                Order Items
              </h2>
              <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 4px;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e7eb;">Product</th>
                    <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e7eb;">Price</th>
                    <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <!-- Order Summary -->
              <div style="margin-top: 20px; padding: 20px; background-color: #f9fafb; border-radius: 4px;">
                <table style="width: 100%;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Subtotal</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151; font-size: 14px;">${formatPrice(data.subtotal)}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Delivery Fee</td>
                    <td style="padding: 8px 0; text-align: right; color: #374151; font-size: 14px;">${formatPrice(data.deliveryFee)}</td>
                  </tr>
                  <tr style="border-top: 2px solid #e5e7eb;">
                    <td style="padding: 12px 0; color: #111827; font-size: 18px; font-weight: 700;">Total</td>
                    <td style="padding: 12px 0; text-align: right; color: #7c3aed; font-size: 18px; font-weight: 700;">${formatPrice(data.total)}</td>
                  </tr>
                </table>
              </div>

              <!-- Delivery Address -->
              <h2 style="margin: 30px 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">
                Delivery Address
              </h2>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; color: #374151; font-size: 14px; line-height: 1.6;">
                  <strong>${data.customerName}</strong><br>
                  ${data.address}<br>
                  ${data.city}<br>
                  Phone: ${data.phone}
                </p>
              </div>

              <!-- Payment Method -->
              <h2 style="margin: 30px 0 15px 0; color: #111827; font-size: 18px; font-weight: 600;">
                Payment Method
              </h2>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  ${data.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '🏦 Bank Transfer'}
                </p>
                ${data.paymentMethod === 'bank_transfer' ? `
                <p style="margin: 10px 0 0 0; color: #d97706; font-size: 13px; background-color: #fef3c7; padding: 12px; border-radius: 4px; border-left: 4px solid #f59e0b;">
                  ⚠️ <strong>Important:</strong> Your order will be processed once we verify your payment.
                </p>
                ` : ''}
              </div>

              <!-- Next Steps -->
              ${data.paymentMethod === 'bank_transfer' ? `
              <div style="margin: 30px 0; padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                  ℹ️ Next Steps
                </h3>
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                  We're currently verifying your bank transfer. Once confirmed, we'll process your order and send you a shipping confirmation.
                </p>
              </div>
              ` : ''}

              <!-- Order Tracking -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${orderTrackingUrl}" style="display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 8px rgba(124,58,237,0.2);">
                  View Order Status
                </a>
                <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px;">
                  You can check your order status anytime at:<br/>
                  <a href="${orderTrackingUrl}" style="color: #7c3aed; text-decoration: none; font-size: 13px; word-break: break-all;">${orderTrackingUrl}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@sahi.lk" style="color: #7c3aed; text-decoration: none;">support@sahi.lk</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Sahi.LK. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate order status update email HTML
 */
function generateStatusUpdateHTML(data: OrderEmailData): string {
  const statusInfo = getStatusInfo(data.status || 'processing');
  
  // Generate order tracking URL
  const orderTrackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sahi.lk'}/order-confirmation/${data.orderId}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0; text-align: center;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: ${statusInfo.gradient}; padding: 40px 30px; text-align: center;">
              <div style="font-size: 48px; margin-bottom: 10px;">${statusInfo.icon}</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ${statusInfo.title}
              </h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                Order #${data.orderId}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #374151; font-size: 16px;">
                Hi <strong>${data.customerName}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                ${statusInfo.message}
              </p>

              <!-- Status Timeline -->
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px; margin: 20px 0;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Order Status</h3>
                <div style="border-left: 3px solid ${statusInfo.color}; padding-left: 20px;">
                  <p style="margin: 0; color: ${statusInfo.color}; font-size: 18px; font-weight: 600;">
                    ${statusInfo.label}
                  </p>
                </div>
              </div>

              ${data.trackingNumber ? `
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                  📦 Tracking Information
                </h3>
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                  Tracking Number: <strong>${data.trackingNumber}</strong>
                </p>
              </div>
              ` : ''}

              <!-- Order Summary -->
              <h3 style="margin: 30px 0 15px 0; color: #111827; font-size: 16px; font-weight: 600;">Order Summary</h3>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                  <strong>Order Total:</strong> ${formatPrice(data.total)}
                </p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>Payment Method:</strong> ${data.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
                </p>
              </div>

              <!-- Order Tracking -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${orderTrackingUrl}" style="display: inline-block; background: #7c3aed; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 8px rgba(124,58,237,0.2);">
                  View Order Status
                </a>
                <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px;">
                  You can check your order status anytime at:<br/>
                  <a href="${orderTrackingUrl}" style="color: #7c3aed; text-decoration: none; font-size: 13px; word-break: break-all;">${orderTrackingUrl}</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                Questions? Contact us at <a href="mailto:support@sahi.lk" style="color: #7c3aed; text-decoration: none;">support@sahi.lk</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Sahi.LK. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Get status display information
 */
function getStatusInfo(status: string) {
  const statusMap: Record<string, any> = {
    pending: {
      icon: '⏳',
      title: 'Order Received',
      label: 'Pending',
      message: 'We\'ve received your order and will start processing it shortly.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    pending_verification: {
      icon: '🔍',
      title: 'Verifying Payment',
      label: 'Payment Verification',
      message: 'We\'re currently verifying your payment. This usually takes a few hours.',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    confirmed: {
      icon: '✅',
      title: 'Order Confirmed',
      label: 'Confirmed',
      message: 'Great news! Your order has been confirmed and we\'re preparing it for shipment.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    processing: {
      icon: '📦',
      title: 'Processing Your Order',
      label: 'Processing',
      message: 'Your order is being prepared for shipment. We\'ll notify you once it\'s ready.',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    shipped: {
      icon: '🚚',
      title: 'Order Shipped',
      label: 'Out for Delivery',
      message: 'Your order is on its way! You should receive it soon.',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    },
    delivered: {
      icon: '🎉',
      title: 'Order Delivered',
      label: 'Delivered',
      message: 'Your order has been delivered. Thank you for shopping with us!',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    cancelled: {
      icon: '❌',
      title: 'Order Cancelled',
      label: 'Cancelled',
      message: 'Your order has been cancelled. If you have any questions, please contact our support team.',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
  };

  return statusMap[status] || statusMap.pending;
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const htmlContent = generateOrderConfirmationHTML(data);
  
  return sendEmail({
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: `Order Confirmation - #${data.orderId} | Sahi.LK`,
    htmlContent,
    textContent: `Order Confirmation\n\nHi ${data.customerName},\n\nThank you for your order #${data.orderId}. We've received it and will process it shortly.\n\nOrder Total: ${formatPrice(data.total)}\n\nThank you for shopping with Sahi.LK!`,
  });
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(data: OrderEmailData): Promise<boolean> {
  const htmlContent = generateStatusUpdateHTML(data);
  const statusInfo = getStatusInfo(data.status || 'processing');
  
  return sendEmail({
    to: [{ email: data.customerEmail, name: data.customerName }],
    subject: `${statusInfo.title} - Order #${data.orderId} | Sahi.LK`,
    htmlContent,
    textContent: `Order Status Update\n\nHi ${data.customerName},\n\n${statusInfo.message}\n\nOrder #${data.orderId}\nStatus: ${statusInfo.label}\n\nThank you for shopping with Sahi.LK!`,
  });
}
