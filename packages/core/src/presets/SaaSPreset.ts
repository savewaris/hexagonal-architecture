import { AuthEngine, AuthTokens } from '../auth/AuthEngine.js';
import { RBACEvaluator } from '../security/RBACEvaluator.js';
import { TokenBucket } from '../security/TokenBucket.js';
import { CryptoEngine } from '../crypto/CryptoEngine.js';

export interface SaaSUserSession {
  userId: string;
  tenantId: string;
  role: string;
  tokens: AuthTokens;
}

/**
 * Plug-and-Play Domain Preset: SaaS Platform Foundation.
 * Pre-wires multi-tenant Auth, RBAC permission matrix, API rate-limiting, and AES PII protection.
 */
export class SaaSPreset {
  public readonly authEngine: AuthEngine;
  public readonly rbacEvaluator: RBACEvaluator;
  public readonly cryptoEngine: CryptoEngine;

  constructor(jwtSecret: string) {
    this.authEngine = new AuthEngine({ jwtSecret });
    this.cryptoEngine = new CryptoEngine(jwtSecret);

    this.rbacEvaluator = new RBACEvaluator([
      { name: 'member', permissions: ['projects:read', 'projects:write'] },
      { name: 'org_admin', permissions: ['billing:*', 'members:*'], inherits: ['member'] },
      { name: 'super_admin', permissions: ['*'] },
    ]);
  }

  public createTenantRateLimiter(capacity = 60, refillRatePerSec = 1): TokenBucket {
    return new TokenBucket({ capacity, refillRate: refillRatePerSec });
  }

  public registerUserSession(userId: string, tenantId: string, role = 'member'): SaaSUserSession {
    const tokens = this.authEngine.generateTokens(userId, role, { tenantId });
    return {
      userId,
      tenantId,
      role,
      tokens,
    };
  }

  public canUserPerformAction(session: SaaSUserSession, action: string): boolean {
    return this.rbacEvaluator.hasPermission({ id: session.userId, roles: [session.role] }, action);
  }
}
