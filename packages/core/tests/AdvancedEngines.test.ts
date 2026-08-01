import { describe, it, expect } from 'vitest';
import {
  CryptoEngine,
  JobQueue,
  Paginator,
  QueryFilter,
  DateTimeEngine,
} from '../src/index.js';

describe('Advanced First-Principles Core Engines Unit Test Suite', () => {
  // 1. Crypto Engine
  describe('CryptoEngine', () => {
    it('should encrypt and decrypt string values using AES-256-GCM', () => {
      const crypto = new CryptoEngine('my_secret_master_key');
      const payload = crypto.encrypt('Sensitive User Data');

      expect(payload.ciphertext).toBeDefined();
      expect(payload.iv).toBeDefined();
      expect(payload.authTag).toBeDefined();

      const decrypted = crypto.decrypt(payload);
      expect(decrypted).toBe('Sensitive User Data');
    });

    it('should mask PII strings correctly', () => {
      expect(CryptoEngine.maskEmail('john.doe@example.com')).toBe('j******e@example.com');
      expect(CryptoEngine.maskPhone('1234567890')).toBe('***-***-7890');
    });
  });

  // 2. Job Queue
  describe('JobQueue', () => {
    it('should process async jobs concurrently with status tracking', async () => {
      const processed: string[] = [];

      const queue = new JobQueue<string>(2, async job => {
        processed.push(job.data);
      });

      queue.enqueue('Task 1');
      queue.enqueue('Task 2');

      // Wait briefly for execution
      await new Promise(r => setTimeout(r, 100));

      expect(processed).toContain('Task 1');
      expect(processed).toContain('Task 2');
      expect(queue.getStats().total).toBe(2);
    });
  });

  // 3. Offset & Cursor Paginator
  describe('Paginator', () => {
    it('should calculate offset pagination metadata', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = Paginator.paginateOffset(items, 2, 3);

      expect(result.data).toEqual([4, 5, 6]);
      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.totalPages).toBe(4);
      expect(result.meta.hasNextPage).toBe(true);
    });
  });

  // 4. Dynamic Query Filter
  describe('QueryFilter', () => {
    it('should filter item arrays based on FilterRule criteria', () => {
      const items = [
        { name: 'Laptop', price: 1200, status: 'ACTIVE' },
        { name: 'Phone', price: 800, status: 'ACTIVE' },
        { name: 'Cable', price: 15, status: 'INACTIVE' },
      ];

      const filtered = QueryFilter.filterItems(items, [
        { field: 'status', operator: 'eq', value: 'ACTIVE' },
        { field: 'price', operator: 'gte', value: 1000 },
      ]);

      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Laptop');
    });
  });

  // 5. DateTime & Business Calendar
  describe('DateTimeEngine', () => {
    it('should calculate business days skipping weekends', () => {
      // Friday Aug 1, 2026
      const friday = new Date(2026, 7, 1);
      const nextBusinessDay = DateTimeEngine.addBusinessDays(friday, 1);

      // Should skip Sat & Sun -> Monday Aug 4, 2026
      expect(nextBusinessDay.getDay()).not.toBe(0); // Not Sunday
      expect(nextBusinessDay.getDay()).not.toBe(6); // Not Saturday
    });
  });
});
