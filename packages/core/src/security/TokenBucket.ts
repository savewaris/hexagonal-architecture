export interface TokenBucketConfig {
  capacity: number;       // Maximum tokens bucket can hold
  refillRate: number;     // Tokens added per second
}

/**
 * First-Principles Core Engine: Token Bucket Rate Limiter.
 * Algorithmic rate limiting with exact timestamp tracking.
 */
export class TokenBucket {
  private capacity: number;
  private refillRate: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  constructor(config: TokenBucketConfig) {
    if (config.capacity <= 0 || config.refillRate <= 0) {
      throw new Error('Capacity and refillRate must be positive numbers.');
    }
    this.capacity = config.capacity;
    this.refillRate = config.refillRate;
    this.tokens = config.capacity;
    this.lastRefillTimestamp = Date.now();
  }

  public tryConsume(tokensToConsume = 1): boolean {
    this.refill();

    if (this.tokens >= tokensToConsume) {
      this.tokens -= tokensToConsume;
      return true;
    }

    return false;
  }

  public getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }

  private refill(): void {
    const now = Date.now();
    const elapsedTimeSeconds = (now - this.lastRefillTimestamp) / 1000;
    const tokensToAdd = elapsedTimeSeconds * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillTimestamp = now;
  }
}
