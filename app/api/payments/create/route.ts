import type { NextRequest } from 'next/server';
import {
  ApiError,
  parseRequestBody,
  validateRequiredFields,
  withAuthentication,
} from '@/lib/api/base';
import { withServices } from '@/lib/container/utils';
import type { CreatePaymentInput } from '@/modules/payments/types';

/**
 * POST /api/payments/create
 * Create a new payment via Mollie
 *
 * Requires authentication
 * Validates amount format and required fields
 * Returns payment with Mollie checkout URL for redirect
 */
export const POST = withAuthentication(async (session, request: NextRequest, context, logger) => {
  const { paymentService } = withServices('paymentService');

  logger?.info('Creating payment', {
    operation: 'createPayment',
    userId: session.user.id,
  });

  const body = await parseRequestBody<CreatePaymentInput>(request);
  validateRequiredFields(body, ['amount', 'currency', 'description']);

  // Validate amount format (must be decimal with 2 places: "10.00")
  if (!/^\d+\.\d{2}$/.test(body.amount)) {
    throw new ApiError(400, 'Amount must be in format: 10.00', 'INVALID_AMOUNT');
  }

  // Validate currency (ISO 4217 codes)
  const supportedCurrencies = ['EUR', 'USD', 'GBP', 'CHF', 'PLN'];
  if (!supportedCurrencies.includes(body.currency)) {
    throw new ApiError(
      400,
      `Currency must be one of: ${supportedCurrencies.join(', ')}`,
      'INVALID_CURRENCY',
    );
  }

  try {
    const payment = await paymentService.createPayment(body, session.user.id);

    logger?.info('Payment created successfully', {
      operation: 'createPayment',
      paymentId: payment.id,
      molliePaymentId: payment.molliePaymentId,
    });

    return { payment };
  } catch (error) {
    logger?.error('Failed to create payment', {
      operation: 'createPayment',
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: session.user.id,
    });

    throw new ApiError(
      500,
      `Failed to create payment: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'PAYMENT_CREATION_FAILED',
    );
  }
});
