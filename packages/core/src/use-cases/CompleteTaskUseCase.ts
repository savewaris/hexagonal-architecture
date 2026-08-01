import { TaskId } from '../domain/value-objects/TaskId.js';
import { Task } from '../domain/entities/Task.js';
import { TaskRepositoryPort } from '../ports/TaskRepositoryPort.js';
import { NotificationPort } from '../ports/NotificationPort.js';

/**
 * Use Case: Complete Task
 * Enforces task completion domain logic and updates persistence via Port interface.
 */
export class CompleteTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly notificationService?: NotificationPort
  ) {}

  public async execute(taskIdString: string, notifyUser?: string): Promise<Task> {
    const taskId = new TaskId(taskIdString);
    const task = await this.taskRepository.findById(taskId);

    if (!task) {
      throw new Error(`Task with ID "${taskIdString}" not found.`);
    }

    // Call domain entity method (enforces rules)
    task.complete();

    await this.taskRepository.save(task);

    if (notifyUser && this.notificationService) {
      await this.notificationService.sendNotification(
        notifyUser,
        `Task "${task.getTitle()}" marked as COMPLETED!`
      );
    }

    return task;
  }
}
