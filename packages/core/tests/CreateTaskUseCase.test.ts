import { describe, it, expect, beforeEach } from 'vitest';
import { CreateTaskUseCase } from '../src/use-cases/CreateTaskUseCase.js';
import { Task, TaskStatus } from '../src/domain/entities/Task.js';
import { TaskId } from '../src/domain/value-objects/TaskId.js';
import type { TaskRepositoryPort } from '../src/ports/TaskRepositoryPort.js';
import type { NotificationPort } from '../src/ports/NotificationPort.js';

// Simple mock implementations for unit testing core logic in isolation
class MockTaskRepository implements TaskRepositoryPort {
  public tasks: Map<string, Task> = new Map();

  async save(task: Task): Promise<void> {
    this.tasks.set(task.getId().getValue(), task);
  }

  async findById(id: TaskId): Promise<Task | null> {
    return this.tasks.get(id.getValue()) || null;
  }

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async delete(id: TaskId): Promise<boolean> {
    return this.tasks.delete(id.getValue());
  }
}

class MockNotificationService implements NotificationPort {
  public sentMessages: { recipient: string; message: string }[] = [];

  async sendNotification(recipient: string, message: string): Promise<void> {
    this.sentMessages.push({ recipient, message });
  }
}

describe('CreateTaskUseCase (Pure Core Logic Test)', () => {
  let repo: MockTaskRepository;
  let notifier: MockNotificationService;
  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    repo = new MockTaskRepository();
    notifier = new MockNotificationService();
    useCase = new CreateTaskUseCase(repo, notifier);
  });

  it('should create a valid pending task and save it to repository', async () => {
    const task = await useCase.execute({
      title: 'Setup Hexagonal Architecture',
      description: 'Isolate pure business domain logic.',
    });

    expect(task).toBeDefined();
    expect(task.getTitle()).toBe('Setup Hexagonal Architecture');
    expect(task.getStatus()).toBe(TaskStatus.PENDING);
    expect(repo.tasks.size).toBe(1);
  });

  it('should send notification when notifyUser is provided', async () => {
    await useCase.execute({
      title: 'Send Notification Test',
      notifyUser: 'user@example.com',
    });

    expect(notifier.sentMessages.length).toBe(1);
    expect(notifier.sentMessages[0].recipient).toBe('user@example.com');
  });

  it('should throw error if task title is invalid', async () => {
    await expect(
      useCase.execute({ title: 'a' })
    ).rejects.toThrow('Task title must be at least 3 characters long.');
  });
});
