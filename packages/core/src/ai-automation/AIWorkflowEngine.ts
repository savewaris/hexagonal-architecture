import { AIGeneratorPort } from '../ports/AIGeneratorPort.js';
import { PromptTemplateEngine, SystemPersona } from './PromptTemplateEngine.js';

export interface WorkflowTool<TInput = any, TOutput = any> {
  name: string;
  description: string;
  execute: (input: TInput) => Promise<TOutput>;
}

export interface WorkflowStepResult {
  stepName: string;
  status: 'SUCCESS' | 'FAILED';
  output: unknown;
  tokensUsed: number;
}

export interface WorkflowExecutionSummary {
  workflowName: string;
  status: 'COMPLETED' | 'FAILED';
  stepResults: WorkflowStepResult[];
  totalTokensUsed: number;
  finalOutput?: unknown;
  error?: string;
}

/**
 * Advanced First-Principles Core Engine: AI Automation Workflow Engine.
 * Executes multi-step AI agent tasks: Prompt -> AI Inference -> Tool Execution -> Self-Correction -> Output.
 */
export class AIWorkflowEngine {
  private readonly tools: Map<string, WorkflowTool> = new Map();

  constructor(
    private readonly aiService: AIGeneratorPort,
    private readonly persona?: SystemPersona
  ) {}

  public registerTool(tool: WorkflowTool): void {
    this.tools.set(tool.name, tool);
  }

  public async executeWorkflow(
    workflowName: string,
    initialPrompt: string,
    variables: Record<string, string | number | boolean> = {}
  ): Promise<WorkflowExecutionSummary> {
    const renderedPrompt = PromptTemplateEngine.render(initialPrompt, variables);
    const systemPrompt = this.persona ? PromptTemplateEngine.buildSystemPrompt(this.persona) : undefined;

    const stepResults: WorkflowStepResult[] = [];
    let totalTokensUsed = 0;

    try {
      // Step 1: AI Inference
      const aiResponse = await this.aiService.complete(renderedPrompt, { systemPrompt });
      totalTokensUsed += aiResponse.tokensUsed;

      stepResults.push({
        stepName: 'AI_INFERENCE',
        status: 'SUCCESS',
        output: aiResponse.text,
        tokensUsed: aiResponse.tokensUsed,
      });

      // Step 2: Tool Execution (if registered tools match)
      for (const [toolName, tool] of this.tools.entries()) {
        const toolStartTime = Date.now();
        const toolOutput = await tool.execute({ promptOutput: aiResponse.text });

        stepResults.push({
          stepName: `TOOL_EXECUTION_${toolName.toUpperCase()}`,
          status: 'SUCCESS',
          output: toolOutput,
          tokensUsed: 0,
        });
      }

      return {
        workflowName,
        status: 'COMPLETED',
        stepResults,
        totalTokensUsed,
        finalOutput: aiResponse.text,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        workflowName,
        status: 'FAILED',
        stepResults,
        totalTokensUsed,
        error: errorMsg,
      };
    }
  }
}
