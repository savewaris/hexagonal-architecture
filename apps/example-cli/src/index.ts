import {
  EcommercePreset,
  SaaSPreset,
  AIAgentPreset,
  ApiServerPreset,
  Money,
} from '@starter/core';

async function main() {
  console.log('🚀 Demonstrating 4 Plug-and-Play Domain Presets...\n');

  // 1. E-Commerce Preset
  console.log('--- 1. E-Commerce Domain Preset ---');
  const ecommerce = new EcommercePreset('sk_live_stripe_key_99');
  const cartItems = [
    { productId: 'p100', title: 'Mechanical Keyboard', unitPrice: Money.fromDecimal(89.99, 'USD'), quantity: 1 },
    { productId: 'p200', title: 'Ergonomic Mouse', unitPrice: Money.fromDecimal(39.99, 'USD'), quantity: 1 },
  ];
  const order = await ecommerce.processOrderPayment('ord_8899', 'customer_id_77', cartItems);
  console.log(`Order ID: ${order.orderId}`);
  console.log(`Order Status: ${order.orderStatus} ✅`);
  console.log(`Total Paid: ${order.chargeResult.amount.format()} (Charge ID: ${order.chargeResult.chargeId})\n`);

  // 2. SaaS Platform Preset
  console.log('--- 2. SaaS Platform Domain Preset ---');
  const saas = new SaaSPreset('saas_master_jwt_secret_key');
  const session = saas.registerUserSession('user_101', 'acme_corp', 'org_admin');
  console.log(`User ID: ${session.userId} | Tenant: ${session.tenantId}`);
  console.log(`Role: ${session.role} | Can access billing? -> ${saas.canUserPerformAction(session, 'billing:manage')}\n`);

  // 3. AI Agent Preset
  console.log('--- 3. AI Agent Workflow Domain Preset ---');
  const aiAgent = new AIAgentPreset('openai', 'sk-demo-key');
  const aiOutput = await aiAgent.runResilientAgentTask('Recommend architecture for global payment processor');
  console.log(`Resilient AI Agent Output: ${aiOutput}\n`);

  // 4. API Server Preset
  console.log('--- 4. REST API Server Domain Preset ---');
  const apiServer = new ApiServerPreset({ NODE_ENV: 'development', PORT: '8080', DB_NAME: 'saas_main_db' });
  await apiServer.bootstrap();
  const apiResponse = apiServer.formatEndpointSuccess({ status: 'HEALTHY', activePresets: 4 });
  console.log('API Endpoint Response Envelope:', JSON.stringify(apiResponse, null, 2));
  await apiServer.shutdown();

  console.log('\n✅ All 4 Plug-and-Play Domain Presets executed successfully!');
}

main().catch(err => console.error('Error running domain presets demo:', err));
