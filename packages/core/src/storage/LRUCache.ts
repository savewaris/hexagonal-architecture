interface CacheEntry<V> {
  value: V;
  expiresAt: number | null;
}

/**
 * First-Principles Core Engine: O(1) LRU (Least Recently Used) Cache with TTL.
 */
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly ttlMs: number | null;
  private readonly cache: Map<K, CacheEntry<V>> = new Map();

  constructor(capacity: number, ttlMs: number | null = null) {
    if (capacity <= 0) throw new Error('Cache capacity must be greater than 0.');
    this.capacity = capacity;
    this.ttlMs = ttlMs;
  }

  public get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check TTL expiration
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    // Refresh LRU order (delete & re-insert to move to end)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  public set(key: K, value: V, customTtlMs?: number): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first item in Map iteration)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    const ttl = customTtlMs ?? this.ttlMs;
    const expiresAt = ttl ? Date.now() + ttl : null;

    this.cache.set(key, { value, expiresAt });
  }

  public has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  public delete(key: K): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public size(): number {
    return this.cache.size;
  }
}
