import {
  InMemoryVectorStore,
  RAGEngine,
  OpenAIAdapter,
  SocialAutomationPreset,
  SecurityHeaders,
  HealthCheckEngine,
} from '@starter/core';

async function main() {
  console.log('🚀 Demonstrating RAG Engine & Facebook Page Automation Preset...\n');

  // 1. Pure RAG Engine (Cosine Similarity Vector Search)
  console.log('--- 1. Pure RAG (Retrieval-Augmented Generation) Engine ---');
  const vectorDb = new InMemoryVectorStore();
  const openAI = new OpenAIAdapter({ apiKey: 'sk-demo-key' });
  const ragEngine = new RAGEngine(vectorDb, openAI);

  await ragEngine.indexDocument(
    'kb_doc_101',
    'Hexagonal Architecture isolates business domain logic inside pure zero-dependency TypeScript modules.',
    [0.15, 0.45, 0.85]
  );

  const ragResult = await ragEngine.query('How does Hexagonal Architecture isolate logic?', [0.15, 0.45, 0.85]);
  console.log(`RAG Retrieved Contexts Count: ${ragResult.retrievedContexts.length}`);
  console.log(`RAG Context Content: "${ragResult.retrievedContexts[0]}"`);
  console.log(`RAG AI Answer: "${ragResult.answer}"\n`);

  // 2. Facebook Page & Post Automation Preset
  console.log('--- 2. Facebook Page Automation Preset ---');
  const fbPreset = new SocialAutomationPreset('EAAX_fb_page_token_demo', 'page_my_company');
  const fbPostResult = await fbPreset.publishNow(
    'page_my_company',
    '🚀 Exciting News! We just launched our new Pure Logic Core Engine!',
    'https://example.com/announcement'
  );

  console.log(`Published Facebook Post ID: ${fbPostResult.postId}`);
  console.log(`Permalink URL: ${fbPostResult.permalinkUrl}`);

  const engagement = await fbPreset.getPostAnalytics(fbPostResult.postId);
  console.log(`Post Engagement Stats: ${engagement.likes} Likes, ${engagement.shares} Shares, ${engagement.reach} Reach\n`);

  // 3. Security Headers & Health Check Probes
  console.log('--- 3. OWASP Security Headers & Health Check Engine ---');
  const headers = SecurityHeaders.generateHeaders({ allowedCorsOrigins: ['https://my-frontend-app.com'] });
  console.log(`Generated Security Header 'X-Content-Type-Options': ${headers['X-Content-Type-Options']}`);

  const healthEngine = new HealthCheckEngine();
  healthEngine.registerProbe({ name: 'vector_db', check: async () => ({ healthy: true }) });
  const healthReport = await healthEngine.evaluateHealth();
  console.log(`Container Health Probe Status: ${healthReport.status} ✅ (Uptime: ${healthReport.uptimeSeconds}s)`);

  console.log('\n✅ RAG Engine & Facebook Automation Preset executed successfully!');
}

main().catch(err => console.error('Error running demonstration:', err));
