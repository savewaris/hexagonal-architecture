import { TaskId } from '../value-objects/TaskId.js';

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface TaskProps {
  id?: TaskId;
  title: string;
  description?: string;
  status?: TaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Task Domain Entity (80% Pure Domain Logic)
 * Contains zero framework or DB dependencies. Enforces business rules.
 */
export class Task {
  private readonly id: TaskId;
  private title: string;
  private description: string;
  private status: TaskStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: TaskProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new Error('Task title cannot be empty.');
    }
    if (props.title.trim().length < 3) {
      throw new Error('Task title must be at least 3 characters long.');
    }

    this.id = props.id || new TaskId();
    this.title = props.title.trim();
    this.description = props.description?.trim() || '';
    this.status = props.status || TaskStatus.PENDING;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  // --- Domain Logic Business Rules ---

  public complete(): void {
    if (this.status === TaskStatus.COMPLETED) {
      throw new Error('Task is already completed.');
    }
    if (this.status === TaskStatus.CANCELLED) {
      throw new Error('Cannot complete a cancelled task.');
    }

    this.status = TaskStatus.COMPLETED;
    this.updatedAt = new Date();
  }

  public cancel(): void {
    if (this.status === TaskStatus.COMPLETED) {
      throw new Error('Cannot cancel a completed task.');
    }
    this.status = TaskStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  // --- Getters ---
  public getId(): TaskId { return this.id; }
  public getTitle(): string { return this.title; }
  public getDescription(): string { return this.description; }
  public getStatus(): TaskStatus { return this.status; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }
}
