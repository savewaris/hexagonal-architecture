export type JobStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface Job<T = unknown> {
  id: string;
  data: T;
  status: JobStatus;
  retryCount: number;
  maxRetries: number;
  error?: string;
}

export type JobHandler<T = unknown> = (job: Job<T>) => Promise<void>;

/**
 * Advanced First-Principles Core Engine: In-Memory Async Job Queue & Worker Engine.
 * Manages concurrency, retries, and task state tracking.
 */
export class JobQueue<T = unknown> {
  private readonly concurrency: number;
  private readonly handler: JobHandler<T>;
  private readonly queue: Job<T>[] = [];
  private readonly jobsMap: Map<string, Job<T>> = new Map();
  private activeWorkers = 0;

  constructor(concurrency: number, handler: JobHandler<T>) {
    this.concurrency = Math.max(1, concurrency);
    this.handler = handler;
  }

  public enqueue(data: T, maxRetries = 3): string {
    const id = `job_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
    const job: Job<T> = {
      id,
      data,
      status: 'PENDING',
      retryCount: 0,
      maxRetries,
    };

    this.queue.push(job);
    this.jobsMap.set(id, job);

    this.processQueue();
    return id;
  }

  public getJob(id: string): Job<T> | undefined {
    return this.jobsMap.get(id);
  }

  public getStats(): { pending: number; running: number; total: number } {
    return {
      pending: this.queue.length,
      running: this.activeWorkers,
      total: this.jobsMap.size,
    };
  }

  private async processQueue(): Promise<void> {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const job = this.queue.shift();
    if (!job) return;

    this.activeWorkers++;
    job.status = 'RUNNING';

    try {
      await this.handler(job);
      job.status = 'COMPLETED';
    } catch (err: any) {
      job.retryCount++;
      if (job.retryCount <= job.maxRetries) {
        job.status = 'PENDING';
        this.queue.push(job); // Re-queue for retry
      } else {
        job.status = 'FAILED';
        job.error = err?.message || String(err);
      }
    } finally {
      this.activeWorkers--;
      this.processQueue(); // Trigger next task
    }
  }
}
