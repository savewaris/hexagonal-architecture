import { Money } from '../financial/Money.js';
import { StateMachine } from '../workflow/StateMachine.js';
import { StripeAdapter } from '../adapters/payment/StripeAdapter.js';
import { LRUCache } from '../storage/LRUCache.js';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type OrderEvent = 'PAY' | 'SHIP' | 'DELIVER' | 'CANCEL';

export interface CartItem {
  productId: string;
  title: string;
  unitPrice: Money;
  quantity: number;
}

/**
 * Plug-and-Play Domain Preset: E-Commerce Core Foundation.
 * Pre-wires zero-float Money math, Order FSM state machine, Stripe payment gateway, and catalog cache.
 */
export class EcommercePreset {
  public readonly catalogCache = new LRUCache<string, CartItem>(100);
  public readonly stripeAdapter: StripeAdapter;

  constructor(stripeApiKey: string) {
    this.stripeAdapter = new StripeAdapter({ apiKey: stripeApiKey });
  }

  public createOrderFSM(initialState: OrderStatus = 'PENDING'): StateMachine<OrderStatus, OrderEvent> {
    return new StateMachine<OrderStatus, OrderEvent>({
      initial: initialState,
      transitions: [
        { from: 'PENDING', event: 'PAY', to: 'PAID' },
        { from: 'PAID', event: 'SHIP', to: 'SHIPPED' },
        { from: 'SHIPPED', event: 'DELIVER', to: 'DELIVERED' },
        { from: ['PENDING', 'PAID'], event: 'CANCEL', to: 'CANCELLED' },
      ],
    });
  }

  public calculateCartTotal(items: CartItem[]): Money {
    if (items.length === 0) return Money.fromDecimal(0, 'USD');

    const currency = items[0].unitPrice.getCurrency();
    let totalCents = 0n;

    for (const item of items) {
      const itemSubtotal = item.unitPrice.multiply(item.quantity);
      totalCents += itemSubtotal.getCents();
    }

    return new Money(totalCents, currency);
  }

  public async processOrderPayment(orderId: string, customerId: string, items: CartItem[]) {
    const totalAmount = this.calculateCartTotal(items);

    const chargeResult = await this.stripeAdapter.charge({
      amount: totalAmount,
      customerId,
      sourceToken: 'tok_visa',
      description: `Payment for Order #${orderId}`,
    });

    const fsm = this.createOrderFSM('PENDING');
    if (chargeResult.status === 'SUCCEEDED') {
      fsm.send('PAY');
    }

    return {
      orderId,
      orderStatus: fsm.getState(),
      chargeResult,
    };
  }
}
