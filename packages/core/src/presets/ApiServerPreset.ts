import { EnvConfigLoader, AppEnvConfig } from '../config/EnvConfigLoader.js';
import { DatabaseManager } from '../database/DatabaseManager.js';
import { Container } from '../di/Container.js';
import { ApiResponse } from '../api/ApiResponse.js';
import { Logger } from '../logging/Logger.js';

/**
 * Plug-and-Play Domain Preset: REST API Server Foundation.
 * Pre-wires Environment loading, Database pool management, Container IoC, Logger, and ApiResponse envelope.
 */
export class ApiServerPreset {
  public readonly config: AppEnvConfig;
  public readonly database: DatabaseManager;
  public readonly container: Container;

  constructor(envDict: Record<string, string | undefined> = process.env) {
    this.config = EnvConfigLoader.load(envDict);
    this.database = new DatabaseManager({
      host: this.config.databaseHost,
      port: this.config.databasePort,
      databaseName: this.config.databaseName,
    });
    this.container = new Container();
  }

  public async bootstrap(): Promise<void> {
    Logger.info(`Bootstrapping API Server on port ${this.config.port}...`);
    await this.database.connect();
    Logger.info(`Connected to database "${this.config.databaseName}". API Server READY ✅`);
  }

  public async shutdown(): Promise<void> {
    await this.database.disconnect();
    Logger.info('API Server gracefully shut down.');
  }

  public formatEndpointSuccess<T>(data: T) {
    return ApiResponse.success(data);
  }

  public formatEndpointError(message: string, statusCode = 400) {
    return ApiResponse.error(message, statusCode);
  }
}
