import { describe, it, expect } from 'vitest';
import {
  Container,
  Schema,
  Money,
  OpenAIAdapter,
  GeminiAdapter,
  StripeAdapter,
  AIGeneratorPort,
  PaymentGatewayPort,
} from '../src/index.js';

describe('Dependency Injection, Pure Schema & External Adapters Unit Test Suite', () => {
  // 1. Dependency Injection Container
  describe('Container (IoC Container)', () => {
    it('should register and resolve Singleton dependencies via Port tokens', () => {
      const container = new Container();

      const AI_TOKEN = Symbol('AIGeneratorPort');

      container.registerSingleton<AIGeneratorPort>(AI_TOKEN, () => {
        return new OpenAIAdapter({ apiKey: 'sk-test-key-123' });
      });

      expect(container.isRegistered(AI_TOKEN)).toBe(true);

      const aiService1 = container.resolve<AIGeneratorPort>(AI_TOKEN);
      const aiService2 = container.resolve<AIGeneratorPort>(AI_TOKEN);

      expect(aiService1).toBe(aiService2); // Same singleton instance
    });

    it('should throw error when resolving unregistered token', () => {
      const container = new Container();
      expect(() => container.resolve('UNREGISTERED_PORT')).toThrow(/is not registered/);
    });
  });

  // 2. Pure Zod-like Schema Validation Engine
  describe('Schema Validation Engine', () => {
    it('should validate string, number, and object schemas strictly', () => {
      const AppConfigSchema = Schema.object({
        appName: Schema.string().min(3),
        port: Schema.number().min(1000).default(8080),
        adminEmail: Schema.string().email(),
      });

      const validResult = AppConfigSchema.parse({
        appName: 'My Pure Logic App',
        port: 3000,
        adminEmail: 'admin@example.com',
      });

      expect(validResult.appName).toBe('My Pure Logic App');
      expect(validResult.port).toBe(3000);
      expect(validResult.adminEmail).toBe('admin@example.com');
    });

    it('should return safeParse errors for invalid inputs without crashing', () => {
      const AppConfigSchema = Schema.object({
        adminEmail: Schema.string().email(),
      });

      const result = AppConfigSchema.safeParse({ adminEmail: 'invalid-email' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBe(1);
        expect(result.errors[0].path).toBe('adminEmail');
      }
    });
  });

  // 3. AI Generator Adapters
  describe('AI Generator Adapters (OpenAI & Gemini)', () => {
    it('should generate text completion using OpenAIAdapter', async () => {
      const adapter = new OpenAIAdapter({ apiKey: 'sk-openai-key' });
      const result = await adapter.complete('Explain clean architecture');

      expect(result.text).toContain('[OpenAI gpt-4o Response]');
      expect(result.tokensUsed).toBeGreaterThan(0);
    });

    it('should generate text completion using GeminiAdapter', async () => {
      const adapter = new GeminiAdapter({ apiKey: 'gemini-key' });
      const result = await adapter.complete('Explain clean architecture');

      expect(result.text).toContain('[Google Gemini gemini-1.5-pro Response]');
      expect(result.tokensUsed).toBeGreaterThan(0);
    });
  });

  // 4. Payment Gateway Adapter (Stripe)
  describe('Payment Gateway Adapter (StripeAdapter)', () => {
    it('should charge customer using StripeAdapter', async () => {
      const stripe = new StripeAdapter({ apiKey: 'sk_stripe_secret' });
      const amount = Money.fromDecimal(99.99, 'USD');

      const chargeResult = await stripe.charge({
        amount,
        customerId: 'cus_12345',
        sourceToken: 'tok_visa',
      });

      expect(chargeResult.status).toBe('SUCCEEDED');
      expect(chargeResult.chargeId).toContain('ch_stripe_');
      expect(chargeResult.amount.toDecimal()).toBe(99.99);
    });

    it('should verify Stripe webhook signatures', () => {
      const stripe = new StripeAdapter({ apiKey: 'sk_stripe_secret' });
      expect(stripe.verifyWebhookSignature('payload', 't=123,v1=sig_hash')).toBe(true);
      expect(stripe.verifyWebhookSignature('payload', 'invalid_sig')).toBe(false);
    });
  });
});
