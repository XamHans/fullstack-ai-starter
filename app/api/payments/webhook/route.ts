import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { ApiError, withErrorHandling } from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';

/**
 * Verify Mollie webhook signature
 * See: https://docs.mollie.com/overview/webhooks#webhook-security
 *
 * @param body Raw request body as string
 * @param signature Signature from X-Mollie-Signature header
 * @param secret Webhook secret from environment
 * @returns true if signature is valid
 */
function verifyWebhookSignature(body: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const calculatedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculatedSignature));
}

/**
 * POST /api/payments/webhook
 * Handle Mollie payment status webhooks
 *
 * No authentication required (validated by signature)
 * Verifies webhook signature for security
 * Updates payment status from Mollie
 * Records webhook event for audit trail
 */
export const POST = withErrorHandling(async (request: NextRequest, context, logger) => {
  const { paymentService } = withServices('paymentService');

  logger?.info('Received payment webhook', { operation: 'webhookHandler' });

  // Get raw body for signature verification
  const rawBody = await request.text();
  const body = JSON.parse(rawBody) as { id: string };

  // Verify webhook signature (production security)
  const signature = request.headers.get('X-Mollie-Signature');
  const webhookSecret = process.env.MOLLIE_WEBHOOK_SECRET;

  if (webhookSecret && !verifyWebhookSignature(rawBody, signature, webhookSecret)) {
    logger?.warn('Invalid webhook signature', {
      operation: 'webhookHandler',
      signature,
    });
    throw new ApiError(401, 'Invalid signature', 'INVALID_SIGNATURE');
  }

  if (!body.id) {
    throw new ApiError(400, 'Missing payment ID', 'MISSING_PAYMENT_ID');
  }

  try {
    // Get payment from database
    const payment = await paymentService.getPaymentByMollieId(body.id);

    if (!payment) {
      logger?.warn('Payment not found in webhook', {
        operation: 'webhookHandler',
        molliePaymentId: body.id,
      });
      throw new ApiError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
    }

    // Update payment status from Mollie
    const updatedPayment = await paymentService.updatePaymentStatus(body.id);

    // Record webhook event for audit trail
    await paymentService.recordWebhookEvent(
      payment.id,
      body.id,
      'payment.updated',
      updatedPayment.status,
      body,
    );

    logger?.info('Webhook processed successfully', {
      operation: 'webhookHandler',
      paymentId: payment.id,
      molliePaymentId: body.id,
      status: updatedPayment.status,
    });

    // Mollie expects 200 OK response
    return { status: 'ok' };
  } catch (error) {
    logger?.error('Failed to process webhook', {
      operation: 'webhookHandler',
      error: error instanceof Error ? error.message : 'Unknown error',
      molliePaymentId: body.id,
    });

    // Re-throw ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      500,
      `Failed to process webhook: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'WEBHOOK_PROCESSING_FAILED',
    );
  }
});
