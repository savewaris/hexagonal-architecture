import {
  Container,
  Schema,
  Money,
  OpenAIAdapter,
  GeminiAdapter,
  StripeAdapter,
  AIGeneratorPort,
  PaymentGatewayPort,
  Logger,
} from '@starter/core';

// Define DI Tokens for Ports
const AI_SERVICE_TOKEN = Symbol('AIGeneratorPort');
const PAYMENT_GATEWAY_TOKEN = Symbol('PaymentGatewayPort');

async function main() {
  console.log('🚀 Demonstrating Dependency Injection, Pure Schema & External Adapters...\n');

  // 1. Validate Environment Config with Pure Schema Engine
  console.log('--- 1. Pure Zod-like Schema Validation Engine ---');
  const EnvSchema = Schema.object({
    openaiApiKey: Schema.string().min(5).default('sk-proj-demo-openai-key'),
    stripeApiKey: Schema.string().min(5).default('sk_live_demo_stripe_key'),
    appPort: Schema.number().min(1000).default(4000),
  });

  const env = EnvSchema.parse({
    openaiApiKey: 'sk-proj-production-key-99',
    stripeApiKey: 'sk_live_production_stripe_key_88',
  });
  console.log(`Validated App Port: ${env.appPort}`);
  console.log(`Validated OpenAI Key: ${env.openaiApiKey.substring(0, 15)}...`);
  console.log(`Validated Stripe Key: ${env.stripeApiKey.substring(0, 15)}...\n`);

  // 2. Setup Dependency Injection IoC Container
  console.log('--- 2. Dependency Injection Container (IoC Bootstrapping) ---');
  const container = new Container();

  // Register AIGeneratorPort -> OpenAIAdapter Singleton
  container.registerSingleton<AIGeneratorPort>(AI_SERVICE_TOKEN, () => {
    return new OpenAIAdapter({ apiKey: env.openaiApiKey, defaultModel: 'gpt-4o' });
  });

  // Register PaymentGatewayPort -> StripeAdapter Singleton
  container.registerSingleton<PaymentGatewayPort>(PAYMENT_GATEWAY_TOKEN, () => {
    return new StripeAdapter({ apiKey: env.stripeApiKey });
  });

  console.log(`Is AI Service Registered? -> ${container.isRegistered(AI_SERVICE_TOKEN)}`);
  console.log(`Is Payment Gateway Registered? -> ${container.isRegistered(PAYMENT_GATEWAY_TOKEN)}\n`);

  // 3. Resolve & Execute Ports via Auto-Wired Adapters
  console.log('--- 3. Resolving & Executing External Adapters via Ports ---');
  const aiService = container.resolve<AIGeneratorPort>(AI_SERVICE_TOKEN);
  const paymentGateway = container.resolve<PaymentGatewayPort>(PAYMENT_GATEWAY_TOKEN);

  // Execute AI Completion
  const aiResult = await aiService.complete('Write a clean architecture recommendation');
  console.log(`AI Completion Output: ${aiResult.text}`);
  console.log(`Tokens Used: ${aiResult.tokensUsed}\n`);

  // Execute Payment Charge
  const chargeResult = await paymentGateway.charge({
    amount: Money.fromDecimal(49.99, 'USD'),
    customerId: 'cus_alice_88',
    sourceToken: 'tok_visa',
  });

  console.log(`Payment Status: ${chargeResult.status} ✅`);
  console.log(`Charge ID: ${chargeResult.chargeId}`);
  console.log(`Receipt URL: ${chargeResult.receiptUrl}\n`);

  console.log('✅ Dependency Injection & External Adapters executed with 100% strict type safety!');
}

main().catch(err => console.error('Error running DI demo:', err));
