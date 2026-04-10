import * as fs from 'fs';
import * as path from 'path';

interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  HOST: string;
  DATABASE_URL: string;
  REDIS_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  OTEL_EXPORTER_OTLP_ENDPOINT: string;
  OTEL_SERVICE_NAME: string;
  OTEL_LOG_LEVEL: string;
}

function loadEnv(): EnvConfig {
  const envFile = process.env.NODE_ENV === 'test'
    ? '.env.test'
    : process.env.NODE_ENV === 'production'
    ? '.env.prod'
    : '.env.local';

  const envPath = path.resolve(process.cwd(), envFile);

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach((line) => {
      const [key, value] = line.split('=');
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    });
  }

  return {
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),
    HOST: process.env.HOST || '0.0.0.0',
    DATABASE_URL: process.env.DATABASE_URL || '',
    REDIS_URL: process.env.REDIS_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
    OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME || 'hexagonal-starter',
    OTEL_LOG_LEVEL: process.env.OTEL_LOG_LEVEL || 'debug',
  };
}

export const config = loadEnv();
