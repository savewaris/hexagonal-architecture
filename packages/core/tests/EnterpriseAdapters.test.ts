import { describe, it, expect } from 'vitest';
import {
  PostgresPoolAdapter,
  PineconeVectorAdapter,
  RedisQueueAdapter,
  S3StorageAdapter,
} from '../src/index.js';

describe('Enterprise Cloud Scale Adapters Unit Test Suite', () => {
  // 1. Postgres Connection Pool
  describe('PostgresPoolAdapter', () => {
    it('should manage connection pool size and execute queries', async () => {
      const db = new PostgresPoolAdapter({
        host: 'postgres.production.aws.com',
        port: 5432,
        databaseName: 'cloud_prod_db',
        maxPoolSize: 50,
      });

      await db.connect();
      const health = await db.checkHealth();
      expect(health.activeConnections).toBe(50);
      expect(health.databaseName).toBe('cloud_prod_db');

      const rows = await db.executeQuery('SELECT * FROM users WHERE id = $1', [100]);
      expect(rows).toEqual([]);

      await db.disconnect();
    });
  });

  // 2. Pinecone Vector Adapter
  describe('PineconeVectorAdapter', () => {
    it('should insert and search vectors in Pinecone index', async () => {
      const pinecone = new PineconeVectorAdapter({
        apiKey: 'pinecone_api_key_123',
        environment: 'us-east1-gcp',
        indexName: 'rag-index-v1',
      });

      await pinecone.insert({
        id: 'vector_doc_1',
        text: 'Scalable cloud vector index document.',
        vector: [0.1, 0.2, 0.3],
      });

      const results = await pinecone.search([0.1, 0.2, 0.3], 1);
      expect(results.length).toBe(1);
      expect(results[0].document.id).toBe('vector_doc_1');
    });
  });

  // 3. Redis Queue Adapter
  describe('RedisQueueAdapter', () => {
    it('should process distributed background jobs with queue name', () => {
      const queue = new RedisQueueAdapter<string>(
        { redisUrl: 'redis://localhost:6379', queueName: 'email_notifications' },
        async job => {}
      );

      expect(queue.getQueueName()).toBe('email_notifications');
      const jobId = queue.enqueue('user@example.com');
      expect(jobId).toBeDefined();
    });
  });

  // 4. S3 Object Storage Adapter
  describe('S3StorageAdapter', () => {
    it('should upload files and generate pre-signed URLs for AWS S3 / Cloudflare R2', async () => {
      const s3 = new S3StorageAdapter({
        region: 'us-west-2',
        accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      });

      const uploadResult = await s3.uploadFile({
        bucket: 'my-media-bucket',
        key: 'avatars/user_1.png',
        content: Buffer.from('fake_image_data'),
      });

      expect(uploadResult.url).toContain('https://my-media-bucket.s3.us-west-2.amazonaws.com/avatars/user_1.png');

      const presignedUrl = await s3.getPresignedUrl('my-media-bucket', 'avatars/user_1.png');
      expect(presignedUrl).toContain('X-Amz-Expires=3600');
    });
  });
});
