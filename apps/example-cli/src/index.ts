import {
  EnvConfigLoader,
  DatabaseManager,
  AuthEngine,
  ApiResponse,
  Logger,
} from '@starter/core';

async function main() {
  console.log('🚀 Demonstrating Universal Immutable Infrastructure & Workflow Engines...\n');

  // 1. Load Type-Safe Environment Config
  console.log('--- 1. Environment Config Engine ---');
  const envConfig = EnvConfigLoader.load({
    NODE_ENV: 'development',
    PORT: '4000',
    DB_HOST: '127.0.0.1',
    DB_PORT: '5432',
    DB_NAME: 'my_production_app_db',
    JWT_SECRET: 'my_ultra_secure_jwt_secret_key_2026',
  });
  console.log(`Environment: ${envConfig.nodeEnv}`);
  console.log(`Configured Database Name: ${envConfig.databaseName}`);
  console.log(`Configured Port: ${envConfig.port}\n`);

  // 2. Structured Logger with Correlation ID Tracking
  console.log('--- 2. Structured Logger & Correlation ID Engine ---');
  Logger.runWithCorrelationId('req_tx_998877', () => {
    Logger.info('Incoming user authentication request received.', { endpoint: '/api/v1/auth/login' });
  });
  console.log('');

  // 3. Database Connection Manager
  console.log('--- 3. Database Connection Pool & Transaction Manager ---');
  const db = new DatabaseManager({
    host: envConfig.databaseHost,
    port: envConfig.databasePort,
    databaseName: envConfig.databaseName,
  });
  await db.connect();
  const health = await db.checkHealth();
  console.log(`Database Health Check: ${health.isConnected ? 'ONLINE ✅' : 'OFFLINE ❌'} (DB: ${health.databaseName})`);

  const dbTxResult = await db.withTransaction(async () => {
    return 'User record updated successfully within transaction boundary.';
  });
  console.log(`Transaction Output: "${dbTxResult}"\n`);

  // 4. Auth & Token Engine
  console.log('--- 4. Authentication & JWT Rotation Engine ---');
  const auth = new AuthEngine({ jwtSecret: envConfig.jwtSecret });
  const hashedPassword = auth.hashPassword('SuperUserSecretPass123!');
  console.log(`PBKDF2 Password Salt & Hash: ${hashedPassword.substring(0, 30)}...`);

  const isValidPass = auth.verifyPassword('SuperUserSecretPass123!', hashedPassword);
  console.log(`Password Verification Result: ${isValidPass ? 'VALID ✅' : 'INVALID ❌'}`);

  const tokens = auth.generateTokens('user_id_101', 'admin');
  console.log(`Generated Access Token: ${tokens.accessToken.substring(0, 35)}...`);
  
  const payload = auth.verifyToken(tokens.accessToken);
  console.log(`Verified Token Claims: User ID = ${payload.userId}, Role = ${payload.role}\n`);

  // 5. Standardized API Response Envelope
  console.log('--- 5. Standardized API Response Envelope ---');
  const responseData = ApiResponse.success({
    user: { id: payload.userId, role: payload.role },
    tokens,
  });
  console.log('API Response Envelope JSON Structure:');
  console.log(JSON.stringify(responseData, null, 2));

  await db.disconnect();
  console.log('\n✅ Universal Immutable Infrastructure Engines executed successfully!');
}

main().catch(err => {
  console.error('❌ Error executing infrastructure engine demonstration:', err);
});
