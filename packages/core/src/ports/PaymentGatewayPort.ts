import { Money } from '../financial/Money.js';

export interface ChargeOptions {
  amount: Money;
  customerId: string;
  sourceToken: string;
  description?: string;
}

export interface ChargeResult {
  chargeId: string;
  amount: Money;
  status: 'SUCCEEDED' | 'PENDING' | 'FAILED';
  receiptUrl?: string;
}

export interface RefundOptions {
  chargeId: string;
  amount?: Money; // Partial or full refund
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  chargeId: string;
  amountRefunded: Money;
  status: 'SUCCEEDED' | 'FAILED';
}

/**
 * Output Port Interface for Payment Gateway Processing.
 * Decouples core payment workflow logic from Stripe, PayPal, or Square APIs.
 */
export interface PaymentGatewayPort {
  charge(options: ChargeOptions): Promise<ChargeResult>;
  refund(options: RefundOptions): Promise<RefundResult>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}
