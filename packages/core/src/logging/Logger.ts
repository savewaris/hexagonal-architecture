import { AsyncLocalStorage } from 'node:async_hooks';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  correlationId?: string;
  meta?: Record<string, unknown>;
}

// AsyncLocalStorage tracks request correlation IDs across asynchronous calls
const asyncLocalStorage = new AsyncLocalStorage<{ correlationId: string }>();

/**
 * Universal Immutable Infrastructure Engine: Structured Logger with Correlation ID Tracking.
 * Outputs formatted JSON log entries with level filtering and request-tracing capabilities.
 */
export class Logger {
  private static minLevel: LogLevel = 'INFO';
  private static readonly levelWeights: Record<LogLevel, number> = {
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
  };

  public static setLogLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public static runWithCorrelationId<T>(correlationId: string, fn: () => T): T {
    return asyncLocalStorage.run({ correlationId }, fn);
  }

  public static debug(message: string, meta?: Record<string, unknown>): void {
    this.log('DEBUG', message, meta);
  }

  public static info(message: string, meta?: Record<string, unknown>): void {
    this.log('INFO', message, meta);
  }

  public static warn(message: string, meta?: Record<string, unknown>): void {
    this.log('WARN', message, meta);
  }

  public static error(message: string, meta?: Record<string, unknown>): void {
    this.log('ERROR', message, meta);
  }

  private static log(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (this.levelWeights[level] < this.levelWeights[this.minLevel]) {
      return;
    }

    const store = asyncLocalStorage.getStore();
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(store?.correlationId && { correlationId: store.correlationId }),
      ...(meta && { meta }),
    };

    const formattedLog = JSON.stringify(entry);
    
    if (level === 'ERROR') {
      console.error(formattedLog);
    } else if (level === 'WARN') {
      console.warn(formattedLog);
    } else {
      console.log(formattedLog);
    }
  }
}
