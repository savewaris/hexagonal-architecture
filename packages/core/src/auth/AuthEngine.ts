import { pbkdf2Sync, randomBytes, createHmac } from 'node:crypto';

export interface TokenPayload {
  userId: string;
  role: string;
  exp: number;
  iat: number;
  [key: string]: unknown;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

export interface AuthConfig {
  jwtSecret: string;
  accessTokenTtlSeconds?: number;
  refreshTokenTtlSeconds?: number;
}

/**
 * Universal Immutable Infrastructure Engine: Complete Authentication & Token Engine.
 * Pure cryptographic password hashing (PBKDF2) and JWT Access/Refresh token rotation.
 */
export class AuthEngine {
  private readonly secret: string;
  private readonly accessTokenTtl: number;
  private readonly refreshTokenTtl: number;

  constructor(config: AuthConfig) {
    if (!config.jwtSecret || config.jwtSecret.trim().length === 0) {
      throw new Error('AuthConfig must provide a non-empty jwtSecret.');
    }
    this.secret = config.jwtSecret;
    this.accessTokenTtl = config.accessTokenTtlSeconds || 3600; // 1 hour default
    this.refreshTokenTtl = config.refreshTokenTtlSeconds || 604800; // 7 days default
  }

  // --- Password Hashing (PBKDF2) ---

  public hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  }

  public verifyPassword(password: string, storedHash: string): boolean {
    const [salt, originalHash] = storedHash.split(':');
    if (!salt || !originalHash) return false;

    const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === originalHash;
  }

  // --- JWT Token Generation & Verification ---

  public generateTokens(userId: string, role = 'user', extraClaims: Record<string, unknown> = {}): AuthTokens {
    const now = Math.floor(Date.now() / 1000);

    const accessPayload: TokenPayload = {
      userId,
      role,
      type: 'access',
      iat: now,
      exp: now + this.accessTokenTtl,
      ...extraClaims,
    };

    const refreshPayload: TokenPayload = {
      userId,
      role,
      type: 'refresh',
      iat: now,
      exp: now + this.refreshTokenTtl,
    };

    return {
      accessToken: this.signJwt(accessPayload),
      refreshToken: this.signJwt(refreshPayload),
      expiresInSeconds: this.accessTokenTtl,
    };
  }

  public verifyToken(token: string): TokenPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format.');
    }

    const [headerB64, payloadB64, signature] = parts;
    const expectedSignature = this.createSignature(`${headerB64}.${payloadB64}`);

    if (signature !== expectedSignature) {
      throw new Error('Invalid JWT signature.');
    }

    const payload: TokenPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      throw new Error('Token has expired.');
    }

    return payload;
  }

  public extractBearerToken(authHeader?: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    return authHeader.substring(7).trim();
  }

  private signJwt(payload: TokenPayload): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = this.createSignature(`${headerB64}.${payloadB64}`);

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  private createSignature(data: string): string {
    return createHmac('sha256', this.secret).update(data).digest('base64url');
  }
}
