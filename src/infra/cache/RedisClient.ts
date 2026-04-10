import { createClient } from 'redis';
import { config } from '@config/env';

let redisClient: ReturnType<typeof createClient> | null = null;

export async function initRedis() {
  if (redisClient) return redisClient;

  redisClient = createClient({
    url: config.REDIS_URL,
  });

  await redisClient.connect();
  console.log('[Redis] Connected');

  return redisClient;
}

export async function getRedis() {
  if (!redisClient) {
    return initRedis();
  }
  return redisClient;
}

export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    console.log('[Redis] Disconnected');
  }
}
