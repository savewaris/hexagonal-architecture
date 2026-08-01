import { CreateTaskUseCase, CompleteTaskUseCase } from '@starter/core';
import { InMemoryTaskRepository, InMemoryNotificationService } from '@starter/adapters-in-memory';

async function main() {
  console.log('🚀 Starting Hexagonal Architecture Clean Core Example Application...\n');

  // 1. Instantiate 20% Adapters (In-Memory Repository & Notification Service)
  const taskRepository = new InMemoryTaskRepository();
  const notificationService = new InMemoryNotificationService();

  // 2. Instantiate 80% Pure Core Use Cases, injecting the Adapter ports
  const createTaskUseCase = new CreateTaskUseCase(taskRepository, notificationService);
  const completeTaskUseCase = new CompleteTaskUseCase(taskRepository, notificationService);

  // 3. Execute Create Task Use Case
  console.log('--- Step 1: Executing CreateTaskUseCase ---');
  const task1 = await createTaskUseCase.execute({
    title: 'Build Pure Domain Logic Package',
    description: 'Keep 80% business logic isolated inside pure TS modules.',
    notifyUser: 'developer@company.com',
  });
  console.log(`Created Task ID: ${task1.getId().getValue()}`);
  console.log(`Task Title: ${task1.getTitle()}`);
  console.log(`Task Status: ${task1.getStatus()}\n`);

  // 4. Execute Complete Task Use Case
  console.log('--- Step 2: Executing CompleteTaskUseCase ---');
  const completedTask = await completeTaskUseCase.execute(
    task1.getId().getValue(),
    'developer@company.com'
  );
  console.log(`Updated Task Status: ${completedTask.getStatus()}\n`);

  // 5. Inspect All Tasks in Repository
  console.log('--- Step 3: Fetching All Saved Tasks from Repository Adapter ---');
  const allTasks = await taskRepository.findAll();
  console.log(`Total Saved Tasks: ${allTasks.length}`);
  allTasks.forEach(t => {
    console.log(`- [${t.getStatus()}] ${t.getTitle()} (ID: ${t.getId().getValue()})`);
  });

  console.log('\n✅ Pure Domain Logic successfully executed and decoupled from external frameworks!');
}

main().catch(err => {
  console.error('❌ Execution Error:', err);
  process.exit(1);
});
