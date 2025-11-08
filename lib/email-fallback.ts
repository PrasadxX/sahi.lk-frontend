/**
 * Email Fallback System
 * 
 * This logs failed email attempts so they can be retried later
 */

interface FailedEmail {
  timestamp: string;
  to: string;
  subject: string;
  orderId: string;
  error: string;
}

/**
 * Log a failed email attempt
 */
export function logFailedEmail(data: FailedEmail): void {
  console.error('=== FAILED EMAIL LOG ===');
  console.error('Timestamp:', data.timestamp);
  console.error('To:', data.to);
  console.error('Subject:', data.subject);
  console.error('Order ID:', data.orderId);
  console.error('Error:', data.error);
  console.error('=======================');
  
  // In production, you might want to:
  // 1. Store in database for manual retry
  // 2. Send to a monitoring service (Sentry, LogRocket, etc.)
  // 3. Queue for background processing
  // 4. Send SMS notification as fallback
  
  // For now, we just log it
  // You can check Vercel logs or server logs to see these failures
}

/**
 * Alternative: Use Vercel's email service or other providers as fallback
 */
export async function sendEmailFallback(params: {
  to: string;
  subject: string;
  text: string;
  orderId: string;
}): Promise<boolean> {
  console.log('Attempting fallback email method...');
  
  // Option 1: Could use Resend.com (simpler API)
  // Option 2: Could use SendGrid
  // Option 3: Could use Mailgun
  // Option 4: Could use your own SMTP server
  
  // For now, just log the failure
  logFailedEmail({
    timestamp: new Date().toISOString(),
    to: params.to,
    subject: params.subject,
    orderId: params.orderId,
    error: 'Primary email service (Brevo) failed, no fallback configured',
  });
  
  return false;
}
