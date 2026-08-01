import { Task, TaskId, TaskRepositoryPort } from '@starter/core';

/**
 * Concrete Adapter implementing TaskRepositoryPort using an In-Memory Map.
 * Provides zero-config fast storage for tests and local prototyping.
 */
export class InMemoryTaskRepository implements TaskRepositoryPort {
  private readonly store: Map<string, Task> = new Map();

  public async save(task: Task): Promise<void> {
    this.store.set(task.getId().getValue(), task);
  }

  public async findById(id: TaskId): Promise<Task | null> {
    return this.store.get(id.getValue()) || null;
  }

  public async findAll(): Promise<Task[]> {
    return Array.from(this.store.values());
  }

  public async delete(id: TaskId): Promise<boolean> {
    return this.store.delete(id.getValue());
  }
}
