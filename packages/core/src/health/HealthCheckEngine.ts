export interface HealthCheckProbe {
  name: string;
  check: () => Promise<{ healthy: boolean; details?: unknown }>;
}

export interface HealthCheckReport {
  status: 'HEALTHY' | 'UNHEALTHY';
  timestamp: string;
  uptimeSeconds: number;
  checks: Record<string, { healthy: boolean; details?: unknown }>;
}

const processStartTime = Date.now();

/**
 * Advanced First-Principles Core Engine: Backend Readiness & Liveness Probe Aggregator.
 * Docker/Kubernetes container health monitor.
 */
export class HealthCheckEngine {
  private readonly probes: Map<string, HealthCheckProbe> = new Map();

  public registerProbe(probe: HealthCheckProbe): void {
    this.probes.set(probe.name, probe);
  }

  public async evaluateHealth(): Promise<HealthCheckReport> {
    const checksResult: Record<string, { healthy: boolean; details?: unknown }> = {};
    let isOverallHealthy = true;

    for (const [name, probe] of this.probes.entries()) {
      try {
        const res = await probe.check();
        checksResult[name] = res;
        if (!res.healthy) isOverallHealthy = false;
      } catch (err: unknown) {
        checksResult[name] = { healthy: false, details: String(err) };
        isOverallHealthy = false;
      }
    }

    return {
      status: isOverallHealthy ? 'HEALTHY' : 'UNHEALTHY',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor((Date.now() - processStartTime) / 1000),
      checks: checksResult,
    };
  }
}
