# Pure Logic Clean Architecture & Hexagonal Monorepo Template

A battle-tested TypeScript Monorepo repository implementing **Hexagonal Architecture (Ports & Adapters)** and **Clean Architecture**.

It enforces a strict separation between **80% Pure Core Domain Logic** and **20% Project-Specific Adapters** (Databases, Web UIs, REST APIs, AI Providers, Social Media Graph APIs).

---

## 🏛️ Comprehensive Architecture & Core Engine Index

```text
hexagonal-clean-architecture-template/
├── packages/
│   ├── core/                                <-- 80% PURE DOMAIN & INFRASTRUCTURE CORE (@starter/core)
│   │   ├── src/
│   │   │   ├── security/                    <-- RBACEvaluator, TokenBucket, CryptoEngine (AES-256-GCM), SecurityHeaders
│   │   │   ├── auth/                        <-- AuthEngine (PBKDF2 Hashing, JWT Access/Refresh Rotation)
│   │   │   ├── database/                    <-- DatabaseManager (Pools, Health Check, Transactions)
│   │   │   ├── config/                      <-- EnvConfigLoader (Type-Safe Environment Loader)
│   │   │   ├── workflow/                    <-- StateMachine (Finite State Machine FSM)
│   │   │   ├── queue/                       <-- JobQueue (In-memory async worker queue)
│   │   │   ├── financial/                   <-- Money (Zero-float precision BigInt currency math)
│   │   │   ├── resilience/                  <-- CircuitBreaker (State pattern failure cascade protection)
│   │   │   ├── storage/                     <-- LRUCache (O(1) TTL eviction), EventBus (Pub-Sub engine)
│   │   │   ├── pagination/                  <-- Paginator (Offset & Base64 Cursor calculator)
│   │   │   ├── filter/                      <-- QueryFilter (Type-safe search filter tree evaluator)
│   │   │   ├── datetime/                    <-- DateTimeEngine (Business days counter & relative time)
│   │   │   ├── health/                      <-- HealthCheckEngine (Kubernetes/Docker readiness & liveness probes)
│   │   │   ├── rag/                         <-- VectorStorePort, RAGEngine, InMemoryVectorStore (Cosine Similarity)
│   │   │   ├── di/                          <-- Container (Pure IoC Dependency Injection)
│   │   │   ├── schema/                      <-- Schema (Zero-dependency Zod-like validation engine)
│   │   │   ├── ports/                       <-- Output Ports (AIGeneratorPort, PaymentGatewayPort, SocialPlatformPort)
│   │   │   ├── adapters/                    <-- Concrete Adapters (OpenAIAdapter, GeminiAdapter, StripeAdapter)
│   │   │   ├── social/                      <-- FacebookAdapter (Graph API Page Posting)
│   │   │   └── presets/                     <-- Plug-and-Play Domain Presets (Ecommerce, SaaS, AI Agent, API, Social)
│   │   └── tests/                           <-- Vitest Unit Test Suites (38+ tests)
│   └── adapters-in-memory/                 <-- 20% IN-MEMORY ADAPTERS (@starter/adapters-in-memory)
├── apps/
│   └── example-cli/                         <-- Sample Runner Application
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

---

## ⚡ The 5 Plug-and-Play Domain Presets

### 1. 🛒 E-Commerce Preset (`EcommercePreset`)
Pre-wires zero-float `Money` math, Order FSM state machine (`PENDING -> PAID -> SHIPPED`), Stripe payment gateway, and catalog cache.

### 2. 🚀 SaaS Platform Preset (`SaaSPreset`)
Pre-wires PBKDF2 password hashing & JWT token rotation (`AuthEngine`), RBAC roles (`RBACEvaluator`), rate limiting (`TokenBucket`), and PII encryption.

### 3. 🤖 AI Agent Workflow Preset (`AIAgentPreset`)
Pre-wires multi-provider AI completions (`OpenAIAdapter`/`GeminiAdapter`), prompt compilation (`PromptTemplateEngine`), tool execution, and circuit breaker.

### 4. 🌐 REST API Server Preset (`ApiServerPreset`)
Pre-wires environment loader (`EnvConfigLoader`), database manager (`DatabaseManager`), JSON logger (`Logger`), and API envelopes (`ApiResponse`).

### 5. 📱 Social Automation Preset (`SocialAutomationPreset`)
Pre-wires Facebook Graph API automated page posting, scheduled post queues, rate limiting, and engagement analytics.

---

## 🚀 Getting Started & Testing

### Prerequisites
- Node.js >= 18.0.0
- `pnpm` workspace runner

### Installation & Execution

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Build TypeScript Packages across workspace
pnpm build

# 3. Execute Vitest Unit Test Suites (38+ tests)
pnpm test

# 4. Run Example Application Demonstrating All Engines & Presets
pnpm --filter example-cli start
```

---

## 🛡️ Cloud Backup & Disaster Recovery (GitHub Sync)

Repository Remote: [`https://github.com/savewaris/hexagonal-architecture.git`](https://github.com/savewaris/hexagonal-architecture.git)

If your computer breaks, restore on any new computer by running:
```bash
git clone https://github.com/savewaris/hexagonal-architecture.git
cd hexagonal-architecture
pnpm install
pnpm test
```
All core engines, domain presets, ports, and tests will be 100% restored!
