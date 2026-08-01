import { NotificationPort } from '@starter/core';

/**
 * Concrete Adapter implementing NotificationPort that logs to console / memory.
 */
export class InMemoryNotificationService implements NotificationPort {
  public readonly logs: { recipient: string; message: string; timestamp: Date }[] = [];

  public async sendNotification(recipient: string, message: string): Promise<void> {
    const entry = { recipient, message, timestamp: new Date() };
    this.logs.push(entry);
    console.log(`[NOTIFICATION ADAPTER] -> Sent to ${recipient}: "${message}"`);
  }
}
