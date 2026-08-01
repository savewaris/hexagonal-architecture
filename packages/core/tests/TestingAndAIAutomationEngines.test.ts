import { describe, it, expect } from 'vitest';
import {
  AssertionEngine,
  TestSuiteRunner,
  MockFactory,
  TestReporter,
  AIWorkflowEngine,
  PromptTemplateEngine,
  OpenAIAdapter,
} from '../src/index.js';

describe('Automated Testing & AI Automation Workflow Engines Unit Test Suite', () => {
  // 1. Pure Assertion Engine
  describe('AssertionEngine', () => {
    it('should assert equality, truthiness, and rejection accurately', async () => {
      AssertionEngine.assertEqual('hello', 'hello');
      AssertionEngine.assertTrue(10 > 5);
      AssertionEngine.assertFalse(5 > 10);
      AssertionEngine.assertDeepEqual({ a: 1 }, { a: 1 });

      await AssertionEngine.assertRejects(async () => {
        throw new Error('Database Error');
      }, 'Database Error');
    });

    it('should throw AssertionError on mismatch', () => {
      expect(() => AssertionEngine.assertEqual('a', 'b')).toThrow();
    });
  });

  // 2. Pure Test Suite Runner & Reporter
  describe('TestSuiteRunner & TestReporter', () => {
    it('should execute test suites and generate JSON reports', async () => {
      const runner = new TestSuiteRunner('Core Math Suite');

      runner.it('should add numbers correctly', () => {
        AssertionEngine.assertEqual(2 + 2, 4);
      });

      runner.it('should multiply numbers', () => {
        AssertionEngine.assertEqual(3 * 3, 9);
      });

      const suiteResult = await runner.run();
      expect(suiteResult.passed).toBe(2);
      expect(suiteResult.failed).toBe(0);

      const jsonReport = TestReporter.generateJSONReport([suiteResult]);
      expect(jsonReport).toContain('Core Math Suite');
      expect(jsonReport).toContain('100.0%');
    });

    it('should run performance micro-benchmarks', async () => {
      const bench = await TestReporter.benchmark('Array Push', () => {
        const arr = [];
        arr.push(1);
      }, 100);

      expect(bench.iterations).toBe(100);
      expect(bench.opsPerSecond).toBeGreaterThan(0);
    });
  });

  // 3. Mock Factory
  describe('MockFactory', () => {
    it('should generate type-safe mock objects tracking calls', () => {
      interface DataService {
        fetchUser(id: string): string;
      }

      const mockService = MockFactory.createMock<DataService>({
        fetchUser: (id: string) => `User_${id}`,
      });

      const result = mockService.fetchUser('123');

      expect(result).toBe('User_123');
      expect(mockService.__calls.length).toBe(1);
      expect(mockService.__calls[0].method).toBe('fetchUser');
      expect(mockService.__calls[0].args).toEqual(['123']);
    });
  });

  // 4. Prompt Template Engine
  describe('PromptTemplateEngine', () => {
    it('should render templates and build system persona prompts', () => {
      const rendered = PromptTemplateEngine.render('Hello {{name}}, code: {{code}}', {
        name: 'Alice',
        code: 200,
      });

      expect(rendered).toBe('Hello Alice, code: 200');

      const systemPrompt = PromptTemplateEngine.buildSystemPrompt({
        name: 'Code Reviewer',
        roleDescription: 'Senior Software Architect',
        constraints: ['Must enforce clean architecture', 'Zero any types allowed'],
      });

      expect(systemPrompt).toContain('You are Code Reviewer.');
      expect(systemPrompt).toContain('- Zero any types allowed');
    });
  });

  // 5. AI Automation Workflow Engine
  describe('AIWorkflowEngine', () => {
    it('should execute multi-step AI workflow with tools', async () => {
      const aiService = new OpenAIAdapter({ apiKey: 'sk-demo-key' });
      const workflow = new AIWorkflowEngine(aiService, {
        name: 'AutoSummarizer',
        roleDescription: 'Summarize code changes',
        constraints: ['Be concise'],
      });

      const toolLogs: string[] = [];
      workflow.registerTool({
        name: 'LoggerTool',
        description: 'Logs workflow progress',
        execute: async (input: any) => {
          toolLogs.push('Tool executed!');
          return { logged: true };
        },
      });

      const summary = await workflow.executeWorkflow(
        'Code Summarization',
        'Summarize project {{projectName}}',
        { projectName: 'Hexagonal Core' }
      );

      expect(summary.status).toBe('COMPLETED');
      expect(summary.totalTokensUsed).toBeGreaterThan(0);
      expect(toolLogs).toContain('Tool executed!');
    });
  });
});
