export interface MockCallRecord {
  method: string;
  args: unknown[];
  timestamp: Date;
}

export type MockedObject<T> = T & {
  __calls: MockCallRecord[];
  __resetMockCalls: () => void;
};

/**
 * Advanced First-Principles Core Engine: Type-Safe Mock Generator Engine.
 * Creates mock implementations of Port interfaces for unit testing without dependencies.
 */
export class MockFactory {
  public static createMock<T extends object>(implementations: Partial<T> = {}): MockedObject<T> {
    const calls: MockCallRecord[] = [];

    const handler: ProxyHandler<object> = {
      get(target, prop, receiver) {
        if (prop === '__calls') return calls;
        if (prop === '__resetMockCalls') return () => { calls.length = 0; };

        const methodName = String(prop);
        const customImpl = Reflect.get(target, prop, receiver);

        if (typeof customImpl === 'function') {
          return (...args: unknown[]) => {
            calls.push({ method: methodName, args, timestamp: new Date() });
            return customImpl(...args);
          };
        }

        return (...args: unknown[]) => {
          calls.push({ method: methodName, args, timestamp: new Date() });
          return undefined;
        };
      },
    };

    return new Proxy(implementations as object, handler) as MockedObject<T>;
  }
}
