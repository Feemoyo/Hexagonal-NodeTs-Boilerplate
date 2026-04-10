import { FastifyReply, FastifyRequest } from 'fastify';
import { JwtAuth } from '@infra/auth/JwtAuth';

export function createAuthMiddleware(jwtAuth: JwtAuth) {
  return async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
    try {
      const token = request.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return reply.status(401).send({ error: 'Missing authorization token' });
      }

      const decoded = jwtAuth.verifyToken(token);
      request.user = decoded;
    } catch (error) {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  };
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: Record<string, any>;
  }
}
