export interface StateMachineConfig<S extends string, E extends string, C = unknown> {
  initial: S;
  transitions: Array<{
    from: S | S[];
    event: E;
    to: S;
    guard?: (context: C) => boolean;
  }>;
  onTransition?: (event: E, from: S, to: S, context: C) => void;
}

/**
 * First-Principles Core Engine: Generic Finite State Machine (FSM).
 * Manages complex state transitions with guard validation and transition hooks.
 */
export class StateMachine<S extends string, E extends string, C = unknown> {
  private currentState: S;
  private readonly transitions: StateMachineConfig<S, E, C>['transitions'];
  private readonly onTransitionCallback?: StateMachineConfig<S, E, C>['onTransition'];

  constructor(config: StateMachineConfig<S, E, C>) {
    this.currentState = config.initial;
    this.transitions = config.transitions;
    this.onTransitionCallback = config.onTransition;
  }

  public getState(): S {
    return this.currentState;
  }

  public can(event: E, context?: C): boolean {
    const transition = this.findTransition(event, context);
    return transition !== undefined;
  }

  public send(event: E, context?: C): S {
    const transition = this.findTransition(event, context);

    if (!transition) {
      throw new Error(`Invalid transition event "${event}" from state "${this.currentState}".`);
    }

    const fromState = this.currentState;
    this.currentState = transition.to;

    if (this.onTransitionCallback) {
      this.onTransitionCallback(event, fromState, this.currentState, context as C);
    }

    return this.currentState;
  }

  private findTransition(event: E, context?: C) {
    return this.transitions.find(t => {
      const matchesFrom = Array.isArray(t.from)
        ? t.from.includes(this.currentState)
        : t.from === this.currentState;

      if (!matchesFrom || t.event !== event) return false;

      if (t.guard && !t.guard(context as C)) return false;

      return true;
    });
  }
}
