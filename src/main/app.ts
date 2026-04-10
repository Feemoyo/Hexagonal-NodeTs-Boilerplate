import Fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import { registerAuthRoutes } from '@api/features/auth/routes';
import { registerHealthRoutes } from '@api/features/health/routes';
import { registerProfileRoutes } from '@api/features/profile/routes';
import { JwtAuth } from '@infra/auth/JwtAuth';
import { config } from '@config/env';

interface CreateAppOptions {
  jwtAuth?: JwtAuth;
  fastifyOptions?: FastifyServerOptions;
}

export async function createApp(options: CreateAppOptions = {}): Promise<FastifyInstance> {
  const jwtAuth = options.jwtAuth ?? new JwtAuth();

  const app = Fastify(
    options.fastifyOptions ?? {
      logger: {
        level: config.NODE_ENV === 'production' ? 'info' : 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }
  );

  await app.register(fastifyHelmet);
  await app.register(fastifyCors, {
    origin: '*',
    credentials: true,
  });

  await registerHealthRoutes(app);
  await registerAuthRoutes(app, jwtAuth);
  await registerProfileRoutes(app, jwtAuth);

  return app;
}
