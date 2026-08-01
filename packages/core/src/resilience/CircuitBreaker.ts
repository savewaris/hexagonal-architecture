export enum CircuitState {
  CLOSED = 'CLOSED',       // Normal operation
  OPEN = 'OPEN',           // Failing, block calls immediately
  HALF_OPEN = 'HALF_OPEN', // Testing recovery with sample calls
}

export interface CircuitBreakerConfig {
  failureThreshold: number;  // Number of failures before opening circuit
  resetTimeoutMs: number;    // Time to wait before attempting half-open recovery
}

/**
 * First-Principles Core Engine: Circuit Breaker.
 * Prevents cascading system failures when calling external unstable services.
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastStateChangeTimestamp: number = Date.now();
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;

  constructor(config: CircuitBreakerConfig) {
    this.failureThreshold = config.failureThreshold;
    this.resetTimeoutMs = config.resetTimeoutMs;
  }

  public getState(): CircuitState {
    this.checkTimeout();
    return this.state;
  }

  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.checkTimeout();

    if (this.state === CircuitState.OPEN) {
      throw new Error('CircuitBreaker is OPEN. Execution blocked to prevent failure cascade.');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastStateChangeTimestamp = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
    }
  }

  private checkTimeout(): void {
    if (this.state === CircuitState.OPEN) {
      const elapsed = Date.now() - this.lastStateChangeTimestamp;
      if (elapsed >= this.resetTimeoutMs) {
        this.state = CircuitState.HALF_OPEN;
      }
    }
  }
}
