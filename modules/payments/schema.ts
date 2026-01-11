import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Payments table - stores all payment transactions via Mollie
 */
export const payments = pgTable('payments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Mollie integration
  molliePaymentId: text('mollie_payment_id').unique().notNull(),
  mollieCheckoutUrl: text('mollie_checkout_url'),

  // Payment details
  amount: text('amount').notNull(), // Store as string to avoid precision issues
  currency: text('currency').notNull(), // ISO 4217 code: EUR, USD, GBP, etc.
  description: text('description').notNull(),
  status: text('status').notNull(), // open, pending, paid, failed, expired, canceled

  // User relationship
  userId: text('user_id').notNull(),

  // Metadata (orderId, productId, etc.)
  metadata: jsonb('metadata'),

  // Timestamps
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
  paidAt: timestamp('paid_at'),
  failedAt: timestamp('failed_at'),
  expiresAt: timestamp('expires_at'),
});

/**
 * Webhook events table - audit trail for all webhook callbacks from Mollie
 */
export const webhookEvents = pgTable('webhook_events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  // Webhook data
  paymentId: text('payment_id')
    .references(() => payments.id)
    .notNull(),
  molliePaymentId: text('mollie_payment_id').notNull(),
  eventType: text('event_type').notNull(), // payment.paid, payment.failed, etc.
  status: text('status').notNull(),

  // Processing
  processed: boolean('processed').default(false).notNull(),
  processedAt: timestamp('processed_at'),

  // Raw webhook payload (for debugging)
  payload: jsonb('payload'),

  // Timestamps
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
});
