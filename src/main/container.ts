import { JwtAuth } from '@infra/auth/JwtAuth';
import { initRedis } from '@infra/cache/RedisClient';
import { queueManager } from '@infra/queue/QueueManager';
import { initDatabase } from '@infra/database';

export interface Container {
  jwtAuth: JwtAuth;
  queueManager: typeof queueManager;
}

let containerInstance: Container | null = null;

export async function initContainer(): Promise<Container> {
  if (containerInstance) {
    return containerInstance;
  }

  // Initialize infrastructure
  await initDatabase();
  await initRedis();

  // Create services
  const jwtAuth = new JwtAuth();

  containerInstance = {
    jwtAuth,
    queueManager,
  };

  console.log('[Container] Initialized');
  return containerInstance;
}

export function getContainer(): Container {
  if (!containerInstance) {
    throw new Error('Container not initialized. Call initContainer() first.');
  }
  return containerInstance;
}
