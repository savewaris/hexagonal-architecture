import { AIGeneratorPort } from '../ports/AIGeneratorPort.js';
import { OpenAIAdapter } from '../adapters/ai/OpenAIAdapter.js';
import { GeminiAdapter } from '../adapters/ai/GeminiAdapter.js';
import { AIWorkflowEngine } from '../ai-automation/AIWorkflowEngine.js';
import { SystemPersona } from '../ai-automation/PromptTemplateEngine.js';
import { CircuitBreaker } from '../resilience/CircuitBreaker.js';

export type AIProvider = 'openai' | 'gemini';

/**
 * Plug-and-Play Domain Preset: AI Agent Workflow Foundation.
 * Pre-wires multi-provider AI adapters, prompt persona compilation, tool execution, and circuit breaker resilience.
 */
export class AIAgentPreset {
  public readonly aiService: AIGeneratorPort;
  public readonly circuitBreaker: CircuitBreaker;

  constructor(provider: AIProvider, apiKey: string) {
    if (provider === 'openai') {
      this.aiService = new OpenAIAdapter({ apiKey, defaultModel: 'gpt-4o' });
    } else {
      this.aiService = new GeminiAdapter({ apiKey, defaultModel: 'gemini-1.5-pro' });
    }

    this.circuitBreaker = new CircuitBreaker({ failureThreshold: 3, resetTimeoutMs: 10000 });
  }

  public createAgentWorkflow(persona: SystemPersona): AIWorkflowEngine {
    return new AIWorkflowEngine(this.aiService, persona);
  }

  public async runResilientAgentTask(prompt: string): Promise<string> {
    return this.circuitBreaker.execute(async () => {
      const response = await this.aiService.complete(prompt);
      return response.text;
    });
  }
}
