export interface SystemPersona {
  name: string;
  roleDescription: string;
  constraints: string[];
}

/**
 * Advanced First-Principles Core Engine: AI Prompt Template & Persona Engine.
 * Dynamically compiles prompt templates, injects personas, and enforces token context rules.
 */
export class PromptTemplateEngine {
  public static render(template: string, variables: Record<string, string | number | boolean>): string {
    let rendered = template;

    for (const key in variables) {
      const value = String(variables[key]);
      rendered = rendered.replaceAll(`{{${key}}}`, value);
    }

    return rendered;
  }

  public static buildSystemPrompt(persona: SystemPersona): string {
    const constraintList = persona.constraints.map(c => `- ${c}`).join('\n');

    return `You are ${persona.name}.
Role: ${persona.roleDescription}

Strict Constraints:
${constraintList}`;
  }

  public static truncateContext(text: string, maxCharacters = 4000): string {
    if (text.length <= maxCharacters) return text;
    return `${text.substring(0, maxCharacters)}... [TRUNCATED]`;
  }
}
