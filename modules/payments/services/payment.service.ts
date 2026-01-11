import mollieClient from '@mollie/api-client';
import { and, desc, eq } from 'drizzle-orm';
import type { ServiceDependencies } from '@/lib/container/types';
import { payments, webhookEvents } from '../schema';
import type { CreatePaymentInput, Payment, PaymentFilters } from '../types';

/**
 * PaymentService - Handles all payment operations via Mollie API
 */
export class PaymentService {
	private mollie: ReturnType<typeof mollieClient>;

	constructor(private deps: ServiceDependencies) {
		// Initialize Mollie client
		this.mollie = mollieClient({
			apiKey: process.env.MOLLIE_API_KEY || '',
		});
	}

	private get logger() {
		return this.deps.logger.child({ service: 'PaymentService' });
	}

	/**
	 * Create a new payment via Mollie
	 * @param data Payment creation input
	 * @param userId ID of the user creating the payment
	 * @returns Created payment record
	 */
	async createPayment(data: CreatePaymentInput, userId: string): Promise<Payment> {
		this.logger.info('Creating Mollie payment', {
			userId,
			amount: data.amount,
			currency: data.currency,
		});

		try {
			// Create payment with Mollie API
			const molliePayment = await this.mollie.payments.create({
				amount: {
					value: data.amount,
					currency: data.currency,
				},
				description: data.description,
				redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payments/return`,
				webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook`,
				metadata: data.metadata,
			});

			// Store payment in database
			const [payment] = await this.deps.db
				.insert(payments)
				.values({
					molliePaymentId: molliePayment.id,
					mollieCheckoutUrl: molliePayment._links.checkout?.href,
					amount: data.amount,
					currency: data.currency,
					description: data.description,
					status: molliePayment.status,
					userId,
					metadata: data.metadata,
					expiresAt: new Date(molliePayment.expiresAt!),
				})
				.returning();

			this.logger.info('Payment created successfully', {
				paymentId: payment.id,
				molliePaymentId: molliePayment.id,
			});

			return payment;
		} catch (error) {
			this.logger.error('Failed to create payment', { error, userId });
			throw error;
		}
	}

	/**
	 * Get payment by internal ID
	 * @param id Internal payment ID (UUID)
	 * @returns Payment record or undefined if not found
	 */
	async getPaymentById(id: string): Promise<Payment | undefined> {
		this.logger.debug('Fetching payment by ID', { paymentId: id });

		const [payment] = await this.deps.db.select().from(payments).where(eq(payments.id, id));

		return payment;
	}

	/**
	 * Get payment by Mollie payment ID
	 * @param molliePaymentId Mollie's payment ID (tr_xxx)
	 * @returns Payment record or undefined if not found
	 */
	async getPaymentByMollieId(molliePaymentId: string): Promise<Payment | undefined> {
		this.logger.debug('Fetching payment by Mollie ID', { molliePaymentId });

		const [payment] = await this.deps.db
			.select()
			.from(payments)
			.where(eq(payments.molliePaymentId, molliePaymentId));

		return payment;
	}

	/**
	 * Update payment status from Mollie webhook
	 * @param molliePaymentId Mollie's payment ID
	 * @returns Updated payment record
	 */
	async updatePaymentStatus(molliePaymentId: string): Promise<Payment> {
		this.logger.info('Updating payment status', { molliePaymentId });

		try {
			// Fetch latest status from Mollie
			const molliePayment = await this.mollie.payments.get(molliePaymentId);

			// Update database
			const [payment] = await this.deps.db
				.update(payments)
				.set({
					status: molliePayment.status,
					paidAt: molliePayment.paidAt ? new Date(molliePayment.paidAt) : null,
					failedAt: molliePayment.failedAt ? new Date(molliePayment.failedAt) : null,
					updatedAt: new Date(),
				})
				.where(eq(payments.molliePaymentId, molliePaymentId))
				.returning();

			this.logger.info('Payment status updated', {
				paymentId: payment.id,
				status: molliePayment.status,
			});

			return payment;
		} catch (error) {
			this.logger.error('Failed to update payment status', { error, molliePaymentId });
			throw error;
		}
	}

	/**
	 * Get user payments with filters
	 * @param filters Filtering options (userId, status, limit, offset)
	 * @returns Array of payment records
	 */
	async getUserPayments(filters: PaymentFilters): Promise<Payment[]> {
		const { userId, status, limit = 20, offset = 0 } = filters;

		this.logger.debug('Fetching user payments', { userId, status, limit, offset });

		const result = await this.deps.db
			.select()
			.from(payments)
			.where(
				and(
					userId ? eq(payments.userId, userId) : undefined,
					status ? eq(payments.status, status) : undefined,
				),
			)
			.orderBy(desc(payments.createdAt))
			.limit(limit)
			.offset(offset);

		return result;
	}

	/**
	 * Record webhook event for audit trail
	 * @param paymentId Internal payment ID
	 * @param molliePaymentId Mollie's payment ID
	 * @param eventType Type of webhook event
	 * @param status Payment status
	 * @param payload Raw webhook payload
	 */
	async recordWebhookEvent(
		paymentId: string,
		molliePaymentId: string,
		eventType: string,
		status: string,
		payload: unknown,
	): Promise<void> {
		this.logger.debug('Recording webhook event', {
			paymentId,
			molliePaymentId,
			eventType,
			status,
		});

		await this.deps.db.insert(webhookEvents).values({
			paymentId,
			molliePaymentId,
			eventType,
			status,
			payload,
		});
	}
}
