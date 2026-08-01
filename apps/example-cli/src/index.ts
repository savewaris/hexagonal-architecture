import {
  PostgresPoolAdapter,
  PineconeVectorAdapter,
  RedisQueueAdapter,
  S3StorageAdapter,
} from '@starter/core';

async function main() {
  console.log('🚀 Demonstrating Enterprise Cloud Scale Adapters...\n');

  // 1. Production PostgreSQL Pool Adapter
  console.log('--- 1. Enterprise PostgreSQL Pool Adapter ---');
  const db = new PostgresPoolAdapter({
    host: 'postgres.production.aws.com',
    port: 5432,
    databaseName: 'enterprise_production_db',
    maxPoolSize: 50,
  });
  await db.connect();
  const health = await db.checkHealth();
  console.log(`Database Pool Health: ONLINE ✅ (Active Pool Connections: ${health.activeConnections})\n`);

  // 2. Production Pinecone Vector DB Adapter
  console.log('--- 2. Enterprise Pinecone Vector Database Adapter ---');
  const pinecone = new PineconeVectorAdapter({
    apiKey: 'pinecone_prod_api_key_8899',
    environment: 'us-east1-gcp',
    indexName: 'enterprise-rag-vectors',
  });
  await pinecone.insert({ id: 'doc_scale_100', text: 'Enterprise scale vector document', vector: [0.1, 0.4, 0.9] });
  const searchResults = await pinecone.search([0.1, 0.4, 0.9], 1);
  console.log(`Pinecone Search Similarity Score: ${searchResults[0].similarityScore.toFixed(4)} (Doc ID: ${searchResults[0].document.id})\n`);

  // 3. Production Redis / BullMQ Queue Adapter
  console.log('--- 3. Enterprise Distributed Redis Queue Adapter ---');
  const redisQueue = new RedisQueueAdapter<string>(
    { redisUrl: 'redis://prod-redis.cluster:6379', queueName: 'email_notifications' },
    async job => console.log(`[REDIS WORKER] -> Processing task: ${job.data}`)
  );
  const jobId = redisQueue.enqueue('user_welcome_email@company.com');
  console.log(`Queued Task to Redis Queue "${redisQueue.getQueueName()}": Task ID = ${jobId}\n`);

  // 4. Production S3 / Cloudflare R2 Object Storage Adapter
  console.log('--- 4. Enterprise AWS S3 / Cloudflare R2 Storage Adapter ---');
  const s3 = new S3StorageAdapter({
    region: 'us-west-2',
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  });
  const uploadResult = await s3.uploadFile({
    bucket: 'company-media-assets',
    key: 'uploads/2026/product_image.png',
    content: Buffer.from('fake_image_bytes'),
  });
  console.log(`S3 Upload Result URL: ${uploadResult.url}`);
  const presignedUrl = await s3.getPresignedUrl('company-media-assets', 'uploads/2026/product_image.png');
  console.log(`Pre-signed Access URL (1 Hour Expiry): ${presignedUrl.substring(0, 75)}...\n`);

  await db.disconnect();
  console.log('✅ Enterprise Cloud Scale Adapters executed successfully!');
}

main().catch(err => console.error('Error executing enterprise demo:', err));
