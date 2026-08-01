export type TestCaseFn = () => void | Promise<void>;

export interface TestResult {
  title: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

export interface SuiteResult {
  name: string;
  results: TestResult[];
  passed: number;
  failed: number;
  totalDurationMs: number;
}

/**
 * Advanced First-Principles Core Engine: Pure Test Suite Runner Engine.
 * Runs unit and integration test blocks without needing external test frameworks.
 */
export class TestSuiteRunner {
  private readonly tests: { title: string; fn: TestCaseFn }[] = [];

  constructor(public readonly suiteName: string) {}

  public it(title: string, fn: TestCaseFn): void {
    this.tests.push({ title, fn });
  }

  public async run(): Promise<SuiteResult> {
    const results: TestResult[] = [];
    let passedCount = 0;
    let failedCount = 0;
    const suiteStartTime = Date.now();

    for (const test of this.tests) {
      const startTime = Date.now();
      try {
        await test.fn();
        const durationMs = Date.now() - startTime;
        results.push({ title: test.title, passed: true, durationMs });
        passedCount++;
      } catch (err: unknown) {
        const durationMs = Date.now() - startTime;
        const errorMsg = err instanceof Error ? err.message : String(err);
        results.push({ title: test.title, passed: false, durationMs, error: errorMsg });
        failedCount++;
      }
    }

    return {
      name: this.suiteName,
      results,
      passed: passedCount,
      failed: failedCount,
      totalDurationMs: Date.now() - suiteStartTime,
    };
  }
}
