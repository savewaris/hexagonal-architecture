export type Token<T> = string | symbol;

export type Factory<T> = (container: Container) => T;

export enum Lifetime {
  SINGLETON = 'SINGLETON',
  TRANSIENT = 'TRANSIENT',
}

interface Registration<T> {
  lifetime: Lifetime;
  factory: Factory<T>;
  instance?: T;
}

/**
 * First-Principles Core Engine: Dependency Injection (DI) IoC Container.
 * Bootstraps and auto-wires Ports (interfaces) to concrete Adapters with lifetime management.
 * 100% strict type safety without using 'any'.
 */
export class Container {
  private readonly registry: Map<Token<unknown>, Registration<unknown>> = new Map();

  public registerSingleton<T>(token: Token<T>, factory: Factory<T>): void {
    this.registry.set(token as Token<unknown>, {
      lifetime: Lifetime.SINGLETON,
      factory: factory as Factory<unknown>,
    });
  }

  public registerTransient<T>(token: Token<T>, factory: Factory<T>): void {
    this.registry.set(token as Token<unknown>, {
      lifetime: Lifetime.TRANSIENT,
      factory: factory as Factory<unknown>,
    });
  }

  public registerInstance<T>(token: Token<T>, instance: T): void {
    this.registry.set(token as Token<unknown>, {
      lifetime: Lifetime.SINGLETON,
      factory: () => instance,
      instance,
    });
  }

  public resolve<T>(token: Token<T>): T {
    const registration = this.registry.get(token as Token<unknown>);

    if (!registration) {
      const tokenName = typeof token === 'symbol' ? token.description : String(token);
      throw new Error(`Dependency Injection Error: Token "${tokenName}" is not registered in Container.`);
    }

    if (registration.lifetime === Lifetime.SINGLETON) {
      if (registration.instance === undefined) {
        registration.instance = registration.factory(this);
      }
      return registration.instance as T;
    }

    return registration.factory(this) as T;
  }

  public isRegistered<T>(token: Token<T>): boolean {
    return this.registry.has(token as Token<unknown>);
  }

  public clear(): void {
    this.registry.clear();
  }
}
