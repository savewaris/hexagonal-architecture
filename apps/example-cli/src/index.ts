import {
  EnvConfigLoader,
  DatabaseManager,
  AuthEngine,
  CryptoEngine,
  JobQueue,
  Paginator,
  QueryFilter,
  DateTimeEngine,
  ApiResponse,
  Logger,
} from '@starter/core';

async function main() {
  console.log('🚀 Demonstrating 10 Production-Grade First-Principles Core Engines...\n');

  // 1. Environment Config Loader
  const env = EnvConfigLoader.load({ DB_NAME: 'production_main_db', JWT_SECRET: 'master_secret_key' });
  console.log(`--- 1. EnvConfig Engine --- (Database: ${env.databaseName})`);

  // 2. Structured Logger
  Logger.runWithCorrelationId('req_tx_001', () => {
    Logger.info('--- 2. Logger Engine --- Executing request pipeline');
  });

  // 3. Database Manager
  const db = new DatabaseManager({ host: env.databaseHost, port: env.databasePort, databaseName: env.databaseName });
  await db.connect();
  console.log(`--- 3. Database Engine --- Connected to ${env.databaseName}`);

  // 4. Auth & Token Engine
  const auth = new AuthEngine({ jwtSecret: env.jwtSecret });
  const hash = auth.hashPassword('MySecretPass123!');
  const tokens = auth.generateTokens('user_55', 'admin');
  console.log(`--- 4. Auth Engine --- Password Hashing & JWT tokens created for ${tokens.accessToken.substring(0, 20)}...`);

  // 5. AES-256-GCM Crypto Engine & PII Masking
  const crypto = new CryptoEngine(env.jwtSecret);
  const encrypted = crypto.encrypt('4111-2222-3333-4444');
  console.log(`--- 5. Crypto Engine --- Encrypted Credit Card: ${encrypted.ciphertext.substring(0, 20)}...`);
  console.log(`Decrypted Value: ${crypto.decrypt(encrypted)}`);
  console.log(`Masked PII Email: ${CryptoEngine.maskEmail('user.private@company.com')}`);

  // 6. Async Job Queue Engine
  const queue = new JobQueue<string>(1, async job => {
    console.log(`--- 6. JobQueue Engine --- Processed Job: "${job.data}"`);
  });
  queue.enqueue('Send Welcome Email');

  // 7. Offset & Cursor Paginator Engine
  const items = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'];
  const paginated = Paginator.paginateOffset(items, 1, 2);
  console.log(`--- 7. Paginator Engine --- Page 1 Result:`, paginated.data, `(Total Pages: ${paginated.meta.totalPages})`);

  // 8. Dynamic Query Filter Engine
  const users = [
    { name: 'Alice', age: 30, role: 'admin' },
    { name: 'Bob', age: 20, role: 'user' },
  ];
  const filtered = QueryFilter.filterItems(users, [{ field: 'age', operator: 'gte', value: 25 }]);
  console.log(`--- 8. QueryFilter Engine --- Matched Users >= 25:`, filtered.map(u => u.name));

  // 9. Timezone & Business Calendar Engine
  const today = new Date();
  const nextBizDay = DateTimeEngine.addBusinessDays(today, 3);
  console.log(`--- 9. DateTime Engine --- Business Days Calculator (+3 days): ${nextBizDay.toDateString()}`);
  console.log(`Relative Time: ${DateTimeEngine.formatRelativeTime(nextBizDay)}`);

  // 10. Standardized API Response Envelope
  console.log('--- 10. ApiResponse Engine --- Response Envelope JSON:');
  console.log(JSON.stringify(ApiResponse.success({ status: 'HEALTHY', enginesActive: 10 }), null, 2));

  await db.disconnect();
  console.log('\n✅ All 10 First-Principles Core Engines executed successfully!');
}

main().catch(err => console.error('Error running engines demo:', err));
