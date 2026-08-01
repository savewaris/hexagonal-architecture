import {
  TestSuiteRunner,
  AssertionEngine,
  MockFactory,
  TestReporter,
  OpenAIAdapter,
  AIWorkflowEngine,
  PromptTemplateEngine,
} from '@starter/core';

async function main() {
  console.log('🚀 Demonstrating Automated Testing Engine & AI Automation Workflow Engine...\n');

  // 1. Pure Test Suite Runner & Assertions Demonstration
  console.log('--- 1. Pure Test Suite Runner & Assertions Engine ---');
  const runner = new TestSuiteRunner('Core Cryptography & Math Suite');

  runner.it('should verify equal numbers', () => {
    AssertionEngine.assertEqual(100, 100);
  });

  runner.it('should verify true conditions', () => {
    AssertionEngine.assertTrue('hello'.length === 5);
  });

  const suiteResult = await runner.run();
  console.log(`Suite: ${suiteResult.name}`);
  console.log(`Passed: ${suiteResult.passed}/${suiteResult.results.length} tests (Duration: ${suiteResult.totalDurationMs}ms)\n`);

  // 2. Micro-Benchmark Runner & Test Reporter
  console.log('--- 2. Micro-Benchmark & Test Reporter ---');
  const benchResult = await TestReporter.benchmark('Crypto Hash Benchmark', () => {
    Math.sin(Math.random() * 100);
  }, 1000);

  console.log(`Benchmark "${benchResult.name}": ${benchResult.opsPerSecond.toLocaleString()} ops/sec (1,000 iterations in ${benchResult.totalDurationMs}ms)`);
  console.log('Automated JSON Test Report:');
  console.log(TestReporter.generateJSONReport([suiteResult]));
  console.log('');

  // 3. AI Automation Workflow Engine
  console.log('--- 3. AI Automation Workflow Engine ---');
  const openAI = new OpenAIAdapter({ apiKey: 'sk-proj-demo-key-100' });
  const aiWorkflow = new AIWorkflowEngine(openAI, {
    name: 'CodeArchitectAgent',
    roleDescription: 'Automates system architecture design & validation',
    constraints: ['Enforce hexagonal ports & adapters', 'Zero un-guarded unknown types'],
  });

  // Register an automated tool into the AI workflow pipeline
  aiWorkflow.registerTool({
    name: 'CodeAuditTool',
    description: 'Audits generated code for architecture violations',
    execute: async (input: { promptOutput: string }) => {
      console.log(`[CODE AUDIT TOOL] -> Inspecting AI output snippet length: ${input.promptOutput.length} chars`);
      return { auditPassed: true, violationsFound: 0 };
    },
  });

  const workflowResult = await aiWorkflow.executeWorkflow(
    'Automated System Architecture Workflow',
    'Design hexagonal ports for domain: {{domainName}}',
    { domainName: 'OrderProcessing' }
  );

  console.log(`Workflow Status: ${workflowResult.status} ✅`);
  console.log(`Total Tokens Consumed: ${workflowResult.totalTokensUsed}`);
  console.log(`Final AI Workflow Output: ${workflowResult.finalOutput}\n`);

  console.log('✅ Automated Testing Engine & AI Automation Workflow Engine executed successfully!');
}

main().catch(err => console.error('Error executing demonstration:', err));
