export class AssertionError extends Error {
  constructor(message: string, public readonly expected?: unknown, public readonly actual?: unknown) {
    super(`AssertionError: ${message}`);
    this.name = 'AssertionError';
  }
}

/**
 * Advanced First-Principles Core Engine: Pure Assertion Engine.
 * Provides zero-dependency assertion primitives with clean error reports.
 */
export class AssertionEngine {
  public static assertEqual<T>(actual: T, expected: T, message?: string): void {
    if (actual !== expected) {
      throw new AssertionError(
        message || `Expected "${String(expected)}", but received "${String(actual)}".`,
        expected,
        actual
      );
    }
  }

  public static assertNotEqual<T>(actual: T, expected: T, message?: string): void {
    if (actual === expected) {
      throw new AssertionError(message || `Expected values not to be equal ("${String(actual)}").`, expected, actual);
    }
  }

  public static assertTrue(value: boolean, message?: string): void {
    if (value !== true) {
      throw new AssertionError(message || 'Expected condition to be true.', true, value);
    }
  }

  public static assertFalse(value: boolean, message?: string): void {
    if (value !== false) {
      throw new AssertionError(message || 'Expected condition to be false.', false, value);
    }
  }

  public static async assertRejects(fn: () => Promise<unknown>, expectedErrorMessage?: string): Promise<void> {
    try {
      await fn();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (expectedErrorMessage && !msg.includes(expectedErrorMessage)) {
        throw new AssertionError(
          `Expected rejected error to include "${expectedErrorMessage}", but got "${msg}".`,
          expectedErrorMessage,
          msg
        );
      }
      return; // Rejection occurred as expected
    }

    throw new AssertionError('Expected function promise to reject, but it resolved successfully.');
  }

  public static assertDeepEqual<T>(actual: T, expected: T, message?: string): void {
    const actStr = JSON.stringify(actual);
    const expStr = JSON.stringify(expected);

    if (actStr !== expStr) {
      throw new AssertionError(
        message || `Deep equality mismatch.\nExpected: ${expStr}\nReceived: ${actStr}`,
        expected,
        actual
      );
    }
  }
}
