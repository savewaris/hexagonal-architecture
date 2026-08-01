import { PaymentGatewayPort, ChargeOptions, ChargeResult, RefundOptions, RefundResult } from '../../ports/PaymentGatewayPort.js';
import { Money } from '../../financial/Money.js';

export interface StripeAdapterConfig {
  apiKey: string;
  webhookSecret?: string;
}

/**
 * Concrete Adapter implementing PaymentGatewayPort for Stripe APIs.
 */
export class StripeAdapter implements PaymentGatewayPort {
  private readonly apiKey: string;
  private readonly webhookSecret: string;

  constructor(config: StripeAdapterConfig) {
    if (!config.apiKey || config.apiKey.trim().length === 0) {
      throw new Error('StripeAdapter requires a valid apiKey.');
    }
    this.apiKey = config.apiKey;
    this.webhookSecret = config.webhookSecret || 'whsec_default_secret';
  }

  public async charge(options: ChargeOptions): Promise<ChargeResult> {
    const chargeId = `ch_stripe_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

    // Simulate Stripe Charge API call
    return {
      chargeId,
      amount: options.amount,
      status: 'SUCCEEDED',
      receiptUrl: `https://pay.stripe.com/receipts/${chargeId}`,
    };
  }

  public async refund(options: RefundOptions): Promise<RefundResult> {
    const refundId = `re_stripe_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    const refundAmount = options.amount || Money.fromDecimal(0, 'USD');

    // Simulate Stripe Refund API call
    return {
      refundId,
      chargeId: options.chargeId,
      amountRefunded: refundAmount,
      status: 'SUCCEEDED',
    };
  }

  public verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!payload || !signature) return false;
    return signature.includes('t=') && signature.includes('v1=');
  }
}
