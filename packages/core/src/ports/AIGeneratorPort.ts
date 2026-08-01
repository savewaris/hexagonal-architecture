export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AICompletionResult {
  text: string;
  model: string;
  tokensUsed: number;
}

/**
 * Output Port Interface for AI Completion & Text Generation Services.
 * Core domain relies strictly on this Port, allowing OpenAI, Gemini, or Claude adapters to plug in.
 */
export interface AIGeneratorPort {
  complete(prompt: string, options?: AICompletionOptions): Promise<AICompletionResult>;
  generateJSON<T extends Record<string, unknown>>(prompt: string, options?: AICompletionOptions): Promise<T>;
}
