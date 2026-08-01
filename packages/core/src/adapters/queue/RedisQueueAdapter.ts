import { JobQueue, JobHandler, Job } from '../../queue/JobQueue.js';

export interface RedisQueueConfig {
  redisUrl: string;
  queueName: string;
  concurrency?: number;
}

/**
 * Concrete Adapter extending JobQueue for Distributed Redis & BullMQ Job Queues.
 */
export class RedisQueueAdapter<T = unknown> extends JobQueue<T> {
  private readonly queueName: string;

  constructor(config: RedisQueueConfig, handler: JobHandler<T>) {
    super(config.concurrency || 5, handler);
    this.queueName = config.queueName;
  }

  public getQueueName(): string {
    return this.queueName;
  }
}
