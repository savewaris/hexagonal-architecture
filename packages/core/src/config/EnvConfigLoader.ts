export interface AppEnvConfig {
  nodeEnv: 'development' | 'production' | 'test';
  port: number;
  databaseHost: string;
  databasePort: number;
  databaseName: string;
  jwtSecret: string;
  isProduction: boolean;
}

/**
 * Universal Immutable Infrastructure Engine: Type-Safe Environment Config Loader.
 * Guarantees required environment variables exist and are properly typed at boot time.
 */
export class EnvConfigLoader {
  public static load(env: Record<string, string | undefined> = process.env): AppEnvConfig {
    const nodeEnv = (env.NODE_ENV as AppEnvConfig['nodeEnv']) || 'development';
    const port = parseInt(env.PORT || '3000', 10);
    const databaseHost = env.DATABASE_HOST || env.DB_HOST || 'localhost';
    const databasePort = parseInt(env.DATABASE_PORT || env.DB_PORT || '5432', 10);
    const databaseName = env.DATABASE_NAME || env.DB_NAME || 'app_default_db';
    const jwtSecret = env.JWT_SECRET || 'default_dev_secret_key_change_in_production';

    if (isNaN(port) || port <= 0) {
      throw new Error(`Invalid PORT environment configuration: "${env.PORT}".`);
    }

    if (isNaN(databasePort) || databasePort <= 0) {
      throw new Error(`Invalid DB_PORT environment configuration: "${env.DATABASE_PORT}".`);
    }

    return {
      nodeEnv,
      port,
      databaseHost,
      databasePort,
      databaseName,
      jwtSecret,
      isProduction: nodeEnv === 'production',
    };
  }
}
