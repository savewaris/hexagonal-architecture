/**
 * Value Object representing a unique Task Identifier.
 * Pure domain logic: guarantees immutability and valid invariants.
 */
export class TaskId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id || TaskId.generateId();
    if (!this.value || this.value.trim().length === 0) {
      throw new Error('TaskId cannot be empty.');
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: TaskId): boolean {
    return this.value === other.getValue();
  }

  private static generateId(): string {
    return `task_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
  }
}
