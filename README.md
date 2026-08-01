# Pure Logic Clean Architecture & Hexagonal Monorepo Starter Template

A battle-tested TypeScript Monorepo boilerplate implementing **Hexagonal Architecture (Ports & Adapters)** and **Clean Architecture**.

It enforces a strict separation between **80% Pure Core Domain Logic** and **20% Project-Specific Adapters** (Databases, Web UIs, REST APIs, CLI tools).

---

## 🏛️ Architecture Overview

```text
                                 +-----------------------------------+
                                 |         20% ADAPTER LAYER         |
                                 | (Web UI / HTTP API / CLI / DBs)  |
                                 +-----------------+-----------------+
                                                   |
                                                   v  (Implements)
+--------------------------------------------------+--------------------------------------------------+
|                                         80% PURE CORE LOGIC                                         |
|                                                                                                     |
|   +--------------------------+    Uses     +------------------------+    Invocations               |
|   |    Application Use Cases | ----------> |       Output Ports     | <--------------+             |
|   |  (CreateTask, Complete)  |             |  (Interfaces/Contracts)|                |             |
|   +------------+-------------+             +------------------------+                |             |
|                |                                                                     |             |
|                | Operates On                                                         |             |
|                v                                                                     |             |
|   +--------------------------+                                                       |             |
|   |      Domain Entities     |                                                       |             |
|   |   (Task, Value Objects)  |                                                       |             |
|   +--------------------------+                                                       |             |
+-----------------------------------------------------------------------------------------------------+
```

### Key Principles:
1. **Zero External Runtime Dependencies in Core**: `@starter/core` contains pure TypeScript logic. No database ORMs, no HTTP frameworks, no UI libraries.
2. **Ports (Interfaces)**: Core logic defines output ports (interfaces like `TaskRepositoryPort`, `NotificationPort`) that define *what* it needs without caring *how* it's done.
3. **Adapters**: External projects implement these ports (e.g., `InMemoryTaskRepository`, `PostgresTaskRepository`, `SendGridNotificationService`).

---

## 📁 Repository Structure

```text
hexagonal-clean-architecture-template/
├── packages/
│   ├── core/                      <-- 80% PURE DOMAIN LOGIC
│   │   ├── src/
│   │   │   ├── domain/            <-- Entities, Value Objects, Domain Rules
│   │   │   ├── use-cases/         <-- Application Interactors
│   │   │   └── ports/             <-- TypeScript Interfaces (Contracts)
│   │   └── tests/                 <-- Vitest Unit Tests (Pure Logic)
│   └── adapters-in-memory/       <-- 20% IN-MEMORY ADAPTERS (Mock DB & Services)
│       └── src/
├── apps/
│   └── example-cli/               <-- Sample Runner Application
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- `pnpm` installed globally: `npm install -g pnpm`

### Installation & Run

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```

2. **Build All Workspace Packages**:
   ```bash
   pnpm build
   ```

3. **Run Unit Tests (Vitest)**:
   ```bash
   pnpm test
   ```

4. **Run Example Application**:
   ```bash
   pnpm --filter example-cli start
   ```

---

## 💡 How to Add a New Project Adapter

When building a new project (e.g. a PostgreSQL backend, a React Web App, or a Mobile App):

1. **Create a new adapter package** in `packages/adapters-postgres` or `apps/web-app`.
2. **Import `@starter/core` ports**:
   ```typescript
   import { TaskRepositoryPort, Task, TaskId } from '@starter/core';

   export class PostgresTaskRepository implements TaskRepositoryPort {
     async save(task: Task): Promise<void> {
       // Save to PostgreSQL database table...
     }
     // Implement remaining interface methods...
   }
   ```
3. **Inject the adapter into the Core Use Case**:
   ```typescript
   const postgresRepo = new PostgresTaskRepository();
   const createTaskUseCase = new CreateTaskUseCase(postgresRepo);
   ```

---

## 🛡️ Cloud Backup & Disaster Recovery Guide

To ensure your codebase is **100% safe if your computer breaks or dies**, follow these steps to back up your repository to GitHub:

### 1. Initialize Git & First Commit
```bash
git init
git add .
git commit -m "Initial commit: Pure Logic Clean Architecture Monorepo Template"
```

### 2. Connect to a Private GitHub Repository
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name it `my-pure-logic-monorepo` and set visibility to **Private**.
3. Do NOT initialize with a README (one already exists).
4. Run in your terminal:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/my-pure-logic-monorepo.git
   git branch -M main
   git push -u origin main
   ```

### 3. Restoring on a New Computer (If your computer dies)
If your old computer breaks:
1. Turn on your new computer.
2. Install Node.js and Git.
3. Clone your GitHub repository:
   ```bash
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/my-pure-logic-monorepo.git
   cd my-pure-logic-monorepo
   pnpm install
   pnpm test
   ```
4. All your pure logic, adapters, and projects will be instantly restored 100%!
