import { config } from '@config/env';
import { initContainer } from './container';
import { closeDatabase } from '@infra/database';
import { closeRedis } from '@infra/cache/RedisClient';
import { initOpenTelemetry } from '@infra/observability/OpenTelemetry';
import { createApp } from './app';

async function bootstrap() {
  initOpenTelemetry();

  const container = await initContainer();
  const app = await createApp({
    jwtAuth: container.jwtAuth,
  });

  async function shutdown() {
    console.log('\n[Server] Shutting down gracefully...');
    await app.close();
    await closeDatabase();
    await closeRedis();
    await container.queueManager.closeAll();
    process.exit(0);
  }

  // Start server
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
    console.log(`[Server] Running on http://${config.HOST}:${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error('[Bootstrap] Fatal error:', err);
  process.exit(1);
});
