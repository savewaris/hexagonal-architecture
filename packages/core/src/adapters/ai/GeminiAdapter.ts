import { AIGeneratorPort, AICompletionOptions, AICompletionResult } from '../../ports/AIGeneratorPort.js';

export interface GeminiAdapterConfig {
  apiKey: string;
  defaultModel?: string;
}

/**
 * Concrete Adapter implementing AIGeneratorPort for Google Gemini API services.
 */
export class GeminiAdapter implements AIGeneratorPort {
  private readonly apiKey: string;
  private readonly defaultModel: string;

  constructor(config: GeminiAdapterConfig) {
    if (!config.apiKey || config.apiKey.trim().length === 0) {
      throw new Error('GeminiAdapter requires a valid apiKey.');
    }
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel || 'gemini-1.5-pro';
  }

  public async complete(prompt: string, options?: AICompletionOptions): Promise<AICompletionResult> {
    const model = options?.model || this.defaultModel;

    // Simulate Google Gemini API completion request
    return {
      text: `[Google Gemini ${model} Response]: Completed prompt "${prompt.substring(0, 30)}..."`,
      model,
      tokensUsed: prompt.length + 38,
    };
  }

  public async generateJSON<T extends Record<string, unknown>>(
    prompt: string,
    options?: AICompletionOptions
  ): Promise<T> {
    const response = await this.complete(`${prompt} (Respond in JSON format)`, options);
    return {
      success: true,
      provider: 'Google Gemini',
      model: response.model,
      output: response.text,
    } as unknown as T;
  }
}
