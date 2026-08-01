import { describe, it, expect } from 'vitest';
import {
  EcommercePreset,
  SaaSPreset,
  AIAgentPreset,
  ApiServerPreset,
  Money,
} from '../src/index.js';

describe('Plug-and-Play Domain Presets Unit Test Suite', () => {
  // 1. E-Commerce Preset
  describe('EcommercePreset', () => {
    it('should calculate cart totals and process order state machine & payments', async () => {
      const preset = new EcommercePreset('sk_test_stripe_123');

      const items = [
        { productId: 'p1', title: 'Keyboard', unitPrice: Money.fromDecimal(49.99, 'USD'), quantity: 2 },
        { productId: 'p2', title: 'Mouse', unitPrice: Money.fromDecimal(19.99, 'USD'), quantity: 1 },
      ];

      const total = preset.calculateCartTotal(items);
      expect(total.toDecimal()).toBe(119.97);

      const orderResult = await preset.processOrderPayment('ord_99', 'cus_11', items);
      expect(orderResult.orderStatus).toBe('PAID');
      expect(orderResult.chargeResult.status).toBe('SUCCEEDED');
    });
  });

  // 2. SaaS Preset
  describe('SaaSPreset', () => {
    it('should issue multi-tenant user sessions and evaluate RBAC actions', () => {
      const saas = new SaaSPreset('saas_jwt_secret_key');
      const session = saas.registerUserSession('usr_org_admin', 'tenant_acme', 'org_admin');

      expect(session.tenantId).toBe('tenant_acme');
      expect(saas.canUserPerformAction(session, 'projects:read')).toBe(true);
      expect(saas.canUserPerformAction(session, 'billing:manage')).toBe(true);
    });
  });

  // 3. AI Agent Preset
  describe('AIAgentPreset', () => {
    it('should execute resilient AI agent tasks', async () => {
      const agentPreset = new AIAgentPreset('openai', 'sk-demo-key');
      const responseText = await agentPreset.runResilientAgentTask('Generate sales report');

      expect(responseText).toContain('[OpenAI gpt-4o Response]');
    });
  });

  // 4. API Server Preset
  describe('ApiServerPreset', () => {
    it('should bootstrap API server, manage DB pool, and format API envelopes', async () => {
      const server = new ApiServerPreset({
        NODE_ENV: 'test',
        PORT: '5000',
        DB_NAME: 'test_preset_db',
      });

      await server.bootstrap();
      expect(server.database.getConfig().databaseName).toBe('test_preset_db');

      const envelope = server.formatEndpointSuccess({ usersCount: 42 });
      expect(envelope.success).toBe(true);
      expect(envelope.data).toEqual({ usersCount: 42 });

      await server.shutdown();
    });
  });
});
