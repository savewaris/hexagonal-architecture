import { describe, it, expect } from 'vitest';
import {
  InMemoryVectorStore,
  RAGEngine,
  OpenAIAdapter,
  FacebookAdapter,
  SocialAutomationPreset,
  SecurityHeaders,
  HealthCheckEngine,
} from '../src/index.js';

describe('RAG, Facebook Automation & Security/Health Probe Unit Test Suite', () => {
  // 1. Pure RAG Engine
  describe('RAGEngine & InMemoryVectorStore', () => {
    it('should index documents and execute Cosine Similarity vector search', async () => {
      const vectorStore = new InMemoryVectorStore();
      const mockVector = [0.1, 0.5, 0.8];

      await vectorStore.insert({
        id: 'doc_1',
        text: 'Clean Architecture isolates pure domain logic.',
        vector: mockVector,
      });

      const searchResults = await vectorStore.search([0.1, 0.5, 0.8], 1);
      expect(searchResults.length).toBe(1);
      expect(searchResults[0].similarityScore).toBeCloseTo(1.0);
    });

    it('should query RAGEngine with context augmentation', async () => {
      const vectorStore = new InMemoryVectorStore();
      const aiService = new OpenAIAdapter({ apiKey: 'sk-demo-key' });
      const rag = new RAGEngine(vectorStore, aiService);

      await rag.indexDocument('kb_doc', 'Hexagonal Architecture relies on Ports and Adapters.', [0.2, 0.4, 0.6]);

      const response = await rag.query('What does Hexagonal Architecture rely on?', [0.2, 0.4, 0.6]);
      expect(response.answer).toBeDefined();
      expect(response.retrievedContexts.length).toBeGreaterThan(0);
    });
  });

  // 2. Facebook Automation
  describe('FacebookAdapter & SocialAutomationPreset', () => {
    it('should publish and schedule Facebook page posts', async () => {
      const fb = new FacebookAdapter({ pageAccessToken: 'fb_token_123', defaultPageId: 'page_999' });

      const pubResult = await fb.publishPost({ pageId: 'page_999', message: 'Hello Facebook Page!' });
      expect(pubResult.published).toBe(true);
      expect(pubResult.permalinkUrl).toContain('facebook.com');

      const stats = await fb.getEngagementStats(pubResult.postId);
      expect(stats.likes).toBeGreaterThan(0);
    });

    it('should queue automated page posts via SocialAutomationPreset', () => {
      const preset = new SocialAutomationPreset('fb_token_123', 'page_999');
      const jobId = preset.queueAutomatedPost('page_999', 'Automated Post Message');
      expect(jobId).toBeDefined();
    });
  });

  // 3. Security Headers & Health Check Engine
  describe('SecurityHeaders & HealthCheckEngine', () => {
    it('should generate OWASP compliant security headers', () => {
      const headers = SecurityHeaders.generateHeaders({
        enableHsts: true,
        allowedCorsOrigins: ['https://example.com'],
      });

      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['Strict-Transport-Security']).toContain('max-age=31536000');
      expect(headers['Access-Control-Allow-Origin']).toBe('https://example.com');
    });

    it('should evaluate backend readiness & liveness probes', async () => {
      const health = new HealthCheckEngine();

      health.registerProbe({
        name: 'database_ping',
        check: async () => ({ healthy: true }),
      });

      const report = await health.evaluateHealth();
      expect(report.status).toBe('HEALTHY');
      expect(report.checks.database_ping.healthy).toBe(true);
    });
  });
});
