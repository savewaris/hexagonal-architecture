import { SuiteResult } from './TestSuiteRunner.js';

export interface BenchmarkResult {
  name: string;
  iterations: number;
  totalDurationMs: number;
  opsPerSecond: number;
}

/**
 * Advanced First-Principles Core Engine: Automated Test Reporter & Benchmark Engine.
 * Generates formatted JSON test reports and micro-benchmark statistics.
 */
export class TestReporter {
  public static generateJSONReport(suites: SuiteResult[]): string {
    const totalSuites = suites.length;
    const totalTests = suites.reduce((acc, s) => acc + s.results.length, 0);
    const totalPassed = suites.reduce((acc, s) => acc + s.passed, 0);
    const totalFailed = suites.reduce((acc, s) => acc + s.failed, 0);
    const overallDurationMs = suites.reduce((acc, s) => acc + s.totalDurationMs, 0);

    return JSON.stringify(
      {
        summary: {
          totalSuites,
          totalTests,
          totalPassed,
          totalFailed,
          successRate: totalTests > 0 ? `${((totalPassed / totalTests) * 100).toFixed(1)}%` : '0%',
          overallDurationMs,
        },
        suites,
      },
      null,
      2
    );
  }

  public static async benchmark(
    name: string,
    fn: () => void | Promise<void>,
    iterations = 1000
  ): Promise<BenchmarkResult> {
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      await fn();
    }

    const totalDurationMs = Math.max(1, Date.now() - startTime);
    const opsPerSecond = Math.round((iterations / totalDurationMs) * 1000);

    return {
      name,
      iterations,
      totalDurationMs,
      opsPerSecond,
    };
  }
}
