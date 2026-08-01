import { Task } from '../domain/entities/Task.js';
import { TaskRepositoryPort } from '../ports/TaskRepositoryPort.js';
import { NotificationPort } from '../ports/NotificationPort.js';

export interface CreateTaskDTO {
  title: string;
  description?: string;
  notifyUser?: string;
}

/**
 * Use Case: Create Task
 * Orchestrates pure domain entity creation and uses output ports.
 */
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepositoryPort,
    private readonly notificationService?: NotificationPort
  ) {}

  public async execute(dto: CreateTaskDTO): Promise<Task> {
    const task = new Task({
      title: dto.title,
      description: dto.description,
    });

    await this.taskRepository.save(task);

    if (dto.notifyUser && this.notificationService) {
      await this.notificationService.sendNotification(
        dto.notifyUser,
        `Task created successfully: "${task.getTitle()}"`
      );
    }

    return task;
  }
}
