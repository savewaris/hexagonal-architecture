// --- First-Principles Computational & Business Rule Engines ---
export { RBACEvaluator } from './security/RBACEvaluator.js';
export type { Permission, RoleDefinition, UserContext } from './security/RBACEvaluator.js';
export { TokenBucket } from './security/TokenBucket.js';
export type { TokenBucketConfig } from './security/TokenBucket.js';
export { StateMachine } from './workflow/StateMachine.js';
export type { StateMachineConfig } from './workflow/StateMachine.js';
export { Money } from './financial/Money.js';
export type { CurrencyCode } from './financial/Money.js';
export { CircuitBreaker, CircuitState } from './resilience/CircuitBreaker.js';
export type { CircuitBreakerConfig } from './resilience/CircuitBreaker.js';
export { LRUCache } from './storage/LRUCache.js';
export { EventBus } from './storage/EventBus.js';
export type { EventHandler } from './storage/EventBus.js';

// --- Universal Immutable Infrastructure & Workflow Engines ---
export { DatabaseManager } from './database/DatabaseManager.js';
export type { DatabaseConfig, ConnectionHealth } from './database/DatabaseManager.js';
export { AuthEngine } from './auth/AuthEngine.js';
export type { AuthConfig, AuthTokens, TokenPayload } from './auth/AuthEngine.js';
export { EnvConfigLoader } from './config/EnvConfigLoader.js';
export type { AppEnvConfig } from './config/EnvConfigLoader.js';
export { ApiResponse } from './api/ApiResponse.js';
export type { ApiSuccessResponse, ApiErrorResponse, ApiResponseEnvelope } from './api/ApiResponse.js';
export { Logger } from './logging/Logger.js';
export type { LogLevel, LogEntry } from './logging/Logger.js';

// --- Advanced First-Principles Core Engines ---
export { CryptoEngine } from './crypto/CryptoEngine.js';
export type { EncryptedPayload } from './crypto/CryptoEngine.js';
export { JobQueue } from './queue/JobQueue.js';
export type { Job, JobStatus, JobHandler } from './queue/JobQueue.js';
export { Paginator } from './pagination/Paginator.js';
export type { OffsetPaginationResult, CursorPaginationResult } from './pagination/Paginator.js';
export { QueryFilter } from './filter/QueryFilter.js';
export type { FilterOperator, FilterRule } from './filter/QueryFilter.js';
export { DateTimeEngine } from './datetime/DateTimeEngine.js';

// --- Dependency Injection Container & Pure Schema Engine ---
export { Container, Lifetime } from './di/Container.js';
export type { Token, Factory } from './di/Container.js';
export { Schema, BaseSchema, StringSchema, NumberSchema, ObjectSchema, SchemaError } from './schema/Schema.js';
export type { ValidationError, ParseResult } from './schema/Schema.js';

// --- Output Ports (Contracts) ---
export type { AIGeneratorPort, AICompletionOptions, AICompletionResult } from './ports/AIGeneratorPort.js';
export type { PaymentGatewayPort, ChargeOptions, ChargeResult, RefundOptions, RefundResult } from './ports/PaymentGatewayPort.js';

// --- External Service Concrete Adapters ---
export { OpenAIAdapter } from './adapters/ai/OpenAIAdapter.js';
export type { OpenAIAdapterConfig } from './adapters/ai/OpenAIAdapter.js';
export { GeminiAdapter } from './adapters/ai/GeminiAdapter.js';
export type { GeminiAdapterConfig } from './adapters/ai/GeminiAdapter.js';
export { StripeAdapter } from './adapters/payment/StripeAdapter.js';
export type { StripeAdapterConfig } from './adapters/payment/StripeAdapter.js';

// --- Automated Testing Engine ---
export { AssertionEngine, AssertionError } from './testing/AssertionEngine.js';
export { TestSuiteRunner } from './testing/TestSuiteRunner.js';
export type { TestCaseFn, TestResult, SuiteResult } from './testing/TestSuiteRunner.js';
export { MockFactory } from './testing/MockFactory.js';
export type { MockCallRecord, MockedObject } from './testing/MockFactory.js';
export { TestReporter } from './testing/TestReporter.js';
export type { BenchmarkResult } from './testing/TestReporter.js';

// --- AI Automation Workflow Engine ---
export { AIWorkflowEngine } from './ai-automation/AIWorkflowEngine.js';
export type { WorkflowTool, WorkflowStepResult, WorkflowExecutionSummary } from './ai-automation/AIWorkflowEngine.js';
export { PromptTemplateEngine } from './ai-automation/PromptTemplateEngine.js';
export type { SystemPersona } from './ai-automation/PromptTemplateEngine.js';

// --- Plug-and-Play Domain Presets ---
export { EcommercePreset } from './presets/EcommercePreset.js';
export type { OrderStatus, OrderEvent, CartItem } from './presets/EcommercePreset.js';
export { SaaSPreset } from './presets/SaaSPreset.js';
export type { SaaSUserSession } from './presets/SaaSPreset.js';
export { AIAgentPreset } from './presets/AIAgentPreset.js';
export type { AIProvider } from './presets/AIAgentPreset.js';
export { ApiServerPreset } from './presets/ApiServerPreset.js';
