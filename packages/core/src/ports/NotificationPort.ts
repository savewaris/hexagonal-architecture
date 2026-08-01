/**
 * Output Port (Interface) for Notifications.
 * Concrete adapters can implement this for Email, SMS, Slack, Webhooks, or In-Memory logs.
 */
export interface NotificationPort {
  sendNotification(recipient: string, message: string): Promise<void>;
}
