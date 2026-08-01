import { Task } from '../domain/entities/Task.js';
import { TaskId } from '../domain/value-objects/TaskId.js';

/**
 * Output Port (Interface) for Data Persistence.
 * Pure logic relies ONLY on this interface, never on direct DB implementations.
 */
export interface TaskRepositoryPort {
  save(task: Task): Promise<void>;
  findById(id: TaskId): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  delete(id: TaskId): Promise<boolean>;
}
