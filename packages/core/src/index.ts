// Domain Entities & Value Objects
export { Task, TaskStatus } from './domain/entities/Task.js';
export type { TaskProps } from './domain/entities/Task.js';
export { TaskId } from './domain/value-objects/TaskId.js';

// Ports (Interfaces)
export type { TaskRepositoryPort } from './ports/TaskRepositoryPort.js';
export type { NotificationPort } from './ports/NotificationPort.js';

// Use Cases
export { CreateTaskUseCase } from './use-cases/CreateTaskUseCase.js';
export type { CreateTaskDTO } from './use-cases/CreateTaskUseCase.js';
export { CompleteTaskUseCase } from './use-cases/CompleteTaskUseCase.js';
