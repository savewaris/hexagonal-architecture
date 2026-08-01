export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'THB' | string;

/**
 * First-Principles Core Engine: Zero-Float Precision Money Value Object.
 * Operates purely on integer smallest-currency-units (cents) to eliminate float math errors.
 */
export class Money {
  private readonly amountInCents: bigint;
  private readonly currency: CurrencyCode;

  constructor(amountInCents: number | bigint, currency: CurrencyCode = 'USD') {
    this.amountInCents = BigInt(Math.round(Number(amountInCents)));
    this.currency = currency.toUpperCase();
  }

  public static fromDecimal(amount: number, currency: CurrencyCode = 'USD'): Money {
    const cents = Math.round(amount * 100);
    return new Money(cents, currency);
  }

  public getCents(): bigint {
    return this.amountInCents;
  }

  public getCurrency(): CurrencyCode {
    return this.currency;
  }

  public toDecimal(): number {
    return Number(this.amountInCents) / 100;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInCents + other.getCents(), this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amountInCents - other.getCents(), this.currency);
  }

  public multiply(multiplier: number): Money {
    const newCents = Math.round(Number(this.amountInCents) * multiplier);
    return new Money(newCents, this.currency);
  }

  public percentage(percent: number): Money {
    return this.multiply(percent / 100);
  }

  public equals(other: Money): boolean {
    return this.currency === other.getCurrency() && this.amountInCents === other.getCents();
  }

  public format(locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
    }).format(this.toDecimal());
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.getCurrency()) {
      throw new Error(`Cannot perform operation between ${this.currency} and ${other.getCurrency()}.`);
    }
  }
}
