import { AIGeneratorPort, AICompletionOptions, AICompletionResult } from '../../ports/AIGeneratorPort.js';

export interface OpenAIAdapterConfig {
  apiKey: string;
  defaultModel?: string;
}

/**
 * Concrete Adapter implementing AIGeneratorPort for OpenAI API services.
 */
export class OpenAIAdapter implements AIGeneratorPort {
  private readonly apiKey: string;
  private readonly defaultModel: string;

  constructor(config: OpenAIAdapterConfig) {
    if (!config.apiKey || config.apiKey.trim().length === 0) {
      throw new Error('OpenAIAdapter requires a valid apiKey.');
    }
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || 'gpt-4o';
  }

  public async complete(prompt: string, options?: AICompletionOptions): Promise<AICompletionResult> {
    const model = options?.model || this.defaultModel;
    
    // Simulate OpenAI API completion request
    return {
      text: `[OpenAI ${model} Response]: Completed prompt "${prompt.substring(0, 30)}..."`,
      model,
      tokensUsed: prompt.length + 42,
    };
  }

  public async generateJSON<T extends Record<string, unknown>>(
    prompt: string,
    options?: AICompletionOptions
  ): Promise<T> {
    const response = await this.complete(`${prompt} (Respond in JSON format)`, options);
    return {
      success: true,
      provider: 'OpenAI',
      model: response.model,
      output: response.text,
    } as unknown as T;
  }
}
