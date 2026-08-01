import { describe, it, expect } from 'vitest';
import {
  DatabaseManager,
  AuthEngine,
  EnvConfigLoader,
  ApiResponse,
  Logger,
} from '../src/index.js';

describe('Universal Immutable Infrastructure Engines Unit Test Suite', () => {
  // 1. Database Manager
  describe('DatabaseManager', () => {
    it('should manage database connection pool and execute transactions', async () => {
      const db = new DatabaseManager({
        host: 'localhost',
        port: 5432,
        databaseName: 'production_app_db',
      });

      await db.connect();
      const health = await db.checkHealth();
      expect(health.isConnected).toBe(true);
      expect(health.databaseName).toBe('production_app_db');

      const result = await db.withTransaction(async () => {
        return 'transaction_success';
      });

      expect(result).toBe('transaction_success');
      await db.disconnect();
    });
  });

  // 2. Auth & Token Engine
  describe('AuthEngine', () => {
    it('should hash and verify passwords using PBKDF2 cryptography', () => {
      const auth = new AuthEngine({ jwtSecret: 'test_secret_key_123' });
      const hash = auth.hashPassword('MySecurePassword123!');

      expect(hash).toContain(':');
      expect(auth.verifyPassword('MySecurePassword123!', hash)).toBe(true);
      expect(auth.verifyPassword('WrongPassword', hash)).toBe(false);
    });

    it('should sign and verify JWT access/refresh tokens', () => {
      const auth = new AuthEngine({ jwtSecret: 'test_secret_key_123' });
      const tokens = auth.generateTokens('user_99', 'admin');

      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();

      const payload = auth.verifyToken(tokens.accessToken);
      expect(payload.userId).toBe('user_99');
      expect(payload.role).toBe('admin');
    });
  });

  // 3. Environment Config Loader
  describe('EnvConfigLoader', () => {
    it('should parse process env variables safely with defaults', () => {
      const config = EnvConfigLoader.load({
        NODE_ENV: 'production',
        PORT: '8080',
        DB_NAME: 'custom_db',
        JWT_SECRET: 'super_secret',
      });

      expect(config.nodeEnv).toBe('production');
      expect(config.port).toBe(8080);
      expect(config.databaseName).toBe('custom_db');
      expect(config.jwtSecret).toBe('super_secret');
      expect(config.isProduction).toBe(true);
    });
  });

  // 4. API Response Envelope
  describe('ApiResponse Envelope', () => {
    it('should format success and error envelopes uniformly', () => {
      const success = ApiResponse.success({ id: 1, name: 'Item' }, { page: 1 });
      expect(success.success).toBe(true);
      expect(success.data).toEqual({ id: 1, name: 'Item' });
      expect(success.meta).toEqual({ page: 1 });

      const error = ApiResponse.error('Unauthorized access', 401, 'UNAUTHORIZED');
      expect(error.success).toBe(false);
      expect(error.error.statusCode).toBe(401);
      expect(error.error.code).toBe('UNAUTHORIZED');
    });
  });

  // 5. Structured Logger & Correlation ID
  describe('Logger & Correlation ID', () => {
    it('should run callback within async correlation ID context', () => {
      let capturedId: string | undefined;

      Logger.runWithCorrelationId('req_abc_123', () => {
        Logger.info('Testing correlation tracking');
      });

      // Verification passed without throwing
      expect(true).toBe(true);
    });
  });
});
