import { describe, it, expect } from 'vitest';
import {
  RBACEvaluator,
  TokenBucket,
  StateMachine,
  Money,
  CircuitBreaker,
  CircuitState,
  LRUCache,
  EventBus,
} from '../src/index.js';

describe('First-Principles Pure Core Engines Unit Test Suite', () => {
  // --- 1. Auth & Security ---
  describe('RBACEvaluator & TokenBucket', () => {
    it('should evaluate permissions and inheritance accurately', () => {
      const rbac = new RBACEvaluator([
        { name: 'viewer', permissions: ['reports:read'] },
        { name: 'admin', permissions: ['users:*'], inherits: ['viewer'] },
      ]);

      const user = { id: 'usr_1', roles: ['admin'] };

      expect(rbac.hasPermission(user, 'users:read')).toBe(true);
      expect(rbac.hasPermission(user, 'users:write')).toBe(true);
      expect(rbac.hasPermission(user, 'reports:read')).toBe(true);
      expect(rbac.hasPermission(user, 'billing:write')).toBe(false);
    });

    it('should rate limit using TokenBucket algorithm', () => {
      const bucket = new TokenBucket({ capacity: 2, refillRate: 1 });

      expect(bucket.tryConsume(1)).toBe(true);
      expect(bucket.tryConsume(1)).toBe(true);
      expect(bucket.tryConsume(1)).toBe(false); // Exhausted
    });
  });

  // --- 2. State Machine ---
  describe('StateMachine (FSM)', () => {
    it('should execute state transitions and enforce guards', () => {
      type State = 'DRAFT' | 'SUBMITTED' | 'APPROVED';
      type Event = 'SUBMIT' | 'APPROVE';

      const fsm = new StateMachine<State, Event>({
        initial: 'DRAFT',
        transitions: [
          { from: 'DRAFT', event: 'SUBMIT', to: 'SUBMITTED' },
          { from: 'SUBMITTED', event: 'APPROVE', to: 'APPROVED' },
        ],
      });

      expect(fsm.getState()).toBe('DRAFT');
      fsm.send('SUBMIT');
      expect(fsm.getState()).toBe('SUBMITTED');
      fsm.send('APPROVE');
      expect(fsm.getState()).toBe('APPROVED');

      expect(() => fsm.send('SUBMIT')).toThrow();
    });
  });

  // --- 3. Financial Math ---
  describe('Money Value Object', () => {
    it('should prevent IEEE-754 float math inaccuracies', () => {
      const m1 = Money.fromDecimal(0.1, 'USD');
      const m2 = Money.fromDecimal(0.2, 'USD');
      const sum = m1.add(m2);

      expect(sum.toDecimal()).toBe(0.3);
      expect(sum.getCents()).toBe(30n);
      expect(sum.format()).toBe('$0.30');
    });
  });

  // --- 4. Resilient Network ---
  describe('CircuitBreaker', () => {
    it('should trip to OPEN after failure threshold reached', async () => {
      const cb = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 1000 });

      const failingFunc = async () => {
        throw new Error('Downstream API Error');
      };

      await expect(cb.execute(failingFunc)).rejects.toThrow('Downstream API Error');
      await expect(cb.execute(failingFunc)).rejects.toThrow('Downstream API Error');

      // Circuit is now OPEN
      expect(cb.getState()).toBe(CircuitState.OPEN);
      await expect(cb.execute(failingFunc)).rejects.toThrow(/Execution blocked/);
    });
  });

  // --- 5. Cache & Pub-Sub ---
  describe('LRUCache & EventBus', () => {
    it('should evict least recently used entries in LRUCache', () => {
      const cache = new LRUCache<string, number>(2);
      cache.set('a', 1);
      cache.set('b', 2);

      cache.get('a'); // Touch 'a', making 'b' the oldest
      cache.set('c', 3); // Evicts 'b'

      expect(cache.get('a')).toBe(1);
      expect(cache.get('b')).toBeUndefined();
      expect(cache.get('c')).toBe(3);
    });

    it('should publish events to subscribers using EventBus', async () => {
      interface Events {
        'user:created': { userId: string };
      }

      const bus = new EventBus<Events>();
      const received: string[] = [];

      bus.subscribe('user:created', data => {
        received.push(data.userId);
      });

      await bus.publish('user:created', { userId: 'usr_999' });

      expect(received).toEqual(['usr_999']);
    });
  });
});
