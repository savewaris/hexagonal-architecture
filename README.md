# First-Principles Pure Core Engines Library

A zero-dependency, production-grade collection of **First-Principles Computational & Business Rule Engines** implemented in pure TypeScript.

```text
                                +-----------------------------------+
                                |     5 FIRST-PRINCIPLES ENGINES    |
                                +-----------------+-----------------+
                                                  |
       +-----------------------+------------------+------------------+-----------------------+
       |                       |                     |               |                       |
       v                       v                     v               v                       v
+--------------+     +-------------------+     +------------+  +-------------------+     +--------------+
| Auth & RBAC  |     | Finite State      |     | Financial  |  | Circuit Breaker   |     | LRU Cache    |
| & RateLimit  |     | Machine (FSM)     |     | Math Engine|  | Resilience Engine |     | & Event Bus  |
+--------------+     +-------------------+     +------------+  +-------------------+     +--------------+
```

---

## 📦 The 5 Core Engines Included

### 1. 🔐 Auth & Security Engine (`security/`)
- **`RBACEvaluator`**: Role-Based & Attribute-Based Access Control matrix supporting wildcard permission resolution (`users:*`, `reports:read`).
- **`TokenBucket`**: Pure Token Bucket rate limiting algorithm for API request throttling.

### 2. ⚙️ State Machine Engine (`workflow/`)
- **`StateMachine`**: Finite State Machine (FSM) enforcing valid state transitions, transition guards, and transition lifecycle callbacks.

### 3. 💰 Financial & Math Engine (`financial/`)
- **`Money`**: Zero-float precision Money Value Object storing amounts in integer cents (`BigInt`) to eliminate IEEE-754 floating-point precision bugs (e.g. `$0.1 + $0.2 = $0.3`).

### 4. 🛡️ Resilient Network Engine (`resilience/`)
- **`CircuitBreaker`**: Circuit Breaker pattern (`CLOSED`, `OPEN`, `HALF_OPEN`) to prevent cascading downstream system outages.

### 5. ⚡ Cache & Pub-Sub Engine (`storage/`)
- **`LRUCache`**: O(1) Least-Recently-Used cache with TTL (Time-To-Live) expiration.
- **`EventBus`**: Strongly-typed Event Emitter / Pub-Sub domain event bus.

---

## 🚀 Usage & Testing

```bash
# Build TypeScript Packages
pnpm build

# Run Unit Tests (Vitest)
pnpm test

# Run Example CLI Engine Demonstration
pnpm --filter example-cli start
```

---

## 🔗 GitHub Synchronization

- Repository: [`https://github.com/savewaris/hexagonal-architecture.git`](https://github.com/savewaris/hexagonal-architecture.git)
- Rule Configuration: Saved in Agent Second Brain (`C:\Users\WIN 11 PRO\.agent-second-brain\.agentrules\hexagonal-template.md`).
