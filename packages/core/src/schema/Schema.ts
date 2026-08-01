export interface ValidationError {
  path: string;
  message: string;
  expected: string;
  received: string;
}

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

export abstract class BaseSchema<T> {
  public abstract parse(value: unknown, path?: string): T;

  public safeParse(value: unknown, path = 'root'): ParseResult<T> {
    try {
      const data = this.parse(value, path);
      return { success: true, data };
    } catch (err: unknown) {
      if (err instanceof SchemaError) {
        return { success: false, errors: err.errors };
      }
      return {
        success: false,
        errors: [{ path, message: String(err), expected: 'valid value', received: typeof value }],
      };
    }
  }
}

export class SchemaError extends Error {
  constructor(public readonly errors: ValidationError[]) {
    super(`Schema Validation Error: ${errors.map(e => `[${e.path}] ${e.message}`).join(', ')}`);
    this.name = 'SchemaError';
  }
}

// --- String Schema ---
export class StringSchema extends BaseSchema<string> {
  private isMinLength?: number;
  private isEmailPattern = false;
  private defaultValue?: string;

  public min(length: number): this {
    this.isMinLength = length;
    return this;
  }

  public email(): this {
    this.isEmailPattern = true;
    return this;
  }

  public default(val: string): this {
    this.defaultValue = val;
    return this;
  }

  public parse(value: unknown, path = 'root'): string {
    if (value === undefined || value === null || value === '') {
      if (this.defaultValue !== undefined) return this.defaultValue;
      throw new SchemaError([{ path, message: 'String is required.', expected: 'string', received: String(value) }]);
    }

    if (typeof value !== 'string') {
      throw new SchemaError([{ path, message: 'Expected string type.', expected: 'string', received: typeof value }]);
    }

    if (this.isMinLength !== undefined && value.length < this.isMinLength) {
      throw new SchemaError([{ path, message: `Minimum length is ${this.isMinLength}.`, expected: `>= ${this.isMinLength} chars`, received: `${value.length} chars` }]);
    }

    if (this.isEmailPattern && !value.includes('@')) {
      throw new SchemaError([{ path, message: 'Invalid email format.', expected: 'email address', received: value }]);
    }

    return value;
  }
}

// --- Number Schema ---
export class NumberSchema extends BaseSchema<number> {
  private isMin?: number;
  private defaultValue?: number;

  public min(val: number): this {
    this.isMin = val;
    return this;
  }

  public default(val: number): this {
    this.defaultValue = val;
    return this;
  }

  public parse(value: unknown, path = 'root'): number {
    if (value === undefined || value === null || value === '') {
      if (this.defaultValue !== undefined) return this.defaultValue;
      throw new SchemaError([{ path, message: 'Number is required.', expected: 'number', received: String(value) }]);
    }

    const num = typeof value === 'number' ? value : Number(value);

    if (isNaN(num)) {
      throw new SchemaError([{ path, message: 'Expected valid number.', expected: 'number', received: String(value) }]);
    }

    if (this.isMin !== undefined && num < this.isMin) {
      throw new SchemaError([{ path, message: `Value must be at least ${this.isMin}.`, expected: `>= ${this.isMin}`, received: String(num) }]);
    }

    return num;
  }
}

// --- Object Schema ---
export type ObjectShape = Record<string, BaseSchema<unknown>>;

export type InferObject<S extends ObjectShape> = {
  [K in keyof S]: S[K] extends BaseSchema<infer T> ? T : never;
};

export class ObjectSchema<S extends ObjectShape> extends BaseSchema<InferObject<S>> {
  constructor(private readonly shape: S) {
    super();
  }

  public parse(value: unknown, path = 'root'): InferObject<S> {
    if (typeof value !== 'object' || value === null) {
      throw new SchemaError([{ path, message: 'Expected object type.', expected: 'object', received: typeof value }]);
    }

    const valObj = value as Record<string, unknown>;
    const result = {} as InferObject<S>;
    const errors: ValidationError[] = [];

    for (const key in this.shape) {
      const fieldSchema = this.shape[key];
      const fieldPath = path === 'root' ? key : `${path}.${key}`;

      try {
        result[key as keyof InferObject<S>] = fieldSchema.parse(valObj[key], fieldPath) as InferObject<S>[keyof InferObject<S>];
      } catch (err: unknown) {
        if (err instanceof SchemaError) {
          errors.push(...err.errors);
        } else {
          errors.push({ path: fieldPath, message: String(err), expected: 'valid field', received: String(valObj[key]) });
        }
      }
    }

    if (errors.length > 0) {
      throw new SchemaError(errors);
    }

    return result;
  }
}

/**
 * Pure Zod-like Schema Builder Engine.
 */
export class Schema {
  public static string(): StringSchema {
    return new StringSchema();
  }

  public static number(): NumberSchema {
    return new NumberSchema();
  }

  public static object<S extends ObjectShape>(shape: S): ObjectSchema<S> {
    return new ObjectSchema(shape);
  }
}
