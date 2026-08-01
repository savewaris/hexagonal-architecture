export type EventHandler<T = any> = (eventData: T) => void | Promise<void>;

/**
 * First-Principles Core Engine: Strongly-Typed Event Bus (Pub-Sub Engine).
 * Decouples message emission and handler subscription.
 */
export class EventBus<Events extends Record<string, any>> {
  private readonly listeners: Map<keyof Events, Set<EventHandler>> = new Map();

  public subscribe<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const handlers = this.listeners.get(event)!;
    handlers.add(handler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
    };
  }

  public async publish<K extends keyof Events>(event: K, data: Events[K]): Promise<void> {
    const handlers = this.listeners.get(event);
    if (!handlers || handlers.size === 0) return;

    const promises = Array.from(handlers).map(handler => Promise.resolve(handler(data)));
    await Promise.all(promises);
  }

  public clear(): void {
    this.listeners.clear();
  }
}
