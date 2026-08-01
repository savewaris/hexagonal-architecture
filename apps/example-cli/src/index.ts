import {
  RBACEvaluator,
  TokenBucket,
  StateMachine,
  Money,
  CircuitBreaker,
  LRUCache,
  EventBus,
} from '@starter/core';

async function main() {
  console.log('🚀 Demonstrating 5 First-Principles Pure Core Engines...\n');

  // 1. Auth & Security Engine
  console.log('--- 1. RBAC & Rate Limiter Engine ---');
  const rbac = new RBACEvaluator([
    { name: 'editor', permissions: ['articles:create', 'articles:edit'] },
    { name: 'admin', permissions: ['*'], inherits: ['editor'] },
  ]);
  const user = { id: 'user_42', roles: ['admin'] };
  console.log(`User holds 'articles:edit' permission? -> ${rbac.hasPermission(user, 'articles:edit')}`);

  const limiter = new TokenBucket({ capacity: 3, refillRate: 1 });
  console.log(`Consuming rate limit token 1/3: ${limiter.tryConsume(1)}`);
  console.log(`Consuming rate limit token 2/3: ${limiter.tryConsume(1)}`);
  console.log(`Consuming rate limit token 3/3: ${limiter.tryConsume(1)}\n`);

  // 2. State Machine Engine
  console.log('--- 2. Finite State Machine (FSM) Engine ---');
  type OrderState = 'PENDING' | 'PAID' | 'SHIPPED';
  type OrderEvent = 'PAY' | 'SHIP';

  const orderFsm = new StateMachine<OrderState, OrderEvent>({
    initial: 'PENDING',
    transitions: [
      { from: 'PENDING', event: 'PAY', to: 'PAID' },
      { from: 'PAID', event: 'SHIP', to: 'SHIPPED' },
    ],
    onTransition: (evt, from, to) => console.log(`Order Transition: [${from}] --(${evt})--> [${to}]`),
  });
  orderFsm.send('PAY');
  orderFsm.send('SHIP');
  console.log(`Final Order State: ${orderFsm.getState()}\n`);

  // 3. Financial Math Engine
  console.log('--- 3. Financial Math Engine (Zero-Float Precision) ---');
  const item1 = Money.fromDecimal(19.99, 'USD');
  const item2 = Money.fromDecimal(5.01, 'USD');
  const total = item1.add(item2);
  console.log(`${item1.format()} + ${item2.format()} = ${total.format()} (Cents: ${total.getCents()})\n`);

  // 4. Resilient Network Engine
  console.log('--- 4. Resilient Circuit Breaker Engine ---');
  const circuit = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 5000 });
  console.log(`Circuit Breaker State: ${circuit.getState()}`);
  const result = await circuit.execute(async () => 'External Service Response Success!');
  console.log(`Result: ${result}\n`);

  // 5. Cache & Event Bus Engine
  console.log('--- 5. O(1) LRU Cache & Event Bus Engine ---');
  const cache = new LRUCache<string, string>(2);
  cache.set('session_1', 'User_Alice');
  cache.set('session_2', 'User_Bob');
  console.log(`Cache Get 'session_1': ${cache.get('session_1')}`);

  const bus = new EventBus<{ 'user:login': { username: string } }>();
  bus.subscribe('user:login', data => console.log(`[EVENT SUB] -> User logged in: ${data.username}`));
  await bus.publish('user:login', { username: 'Alice' });

  console.log('\n✅ All 5 First-Principles Pure Core Engines executed successfully!');
}

main().catch(err => {
  console.error('❌ Error executing example application:', err);
});
