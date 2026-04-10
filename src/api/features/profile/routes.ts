import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';
import { JwtAuth } from '@infra/auth/JwtAuth';
import { createAuthMiddleware } from '@api/middlewares/AuthMiddleware';

async function getProfileHandler(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = request.user;

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: 'No user data found in token',
      });
    }

    return reply.status(200).send({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        iat: user.iat,
        exp: user.exp,
      },
    });
  } catch (error: any) {
    return reply.status(500).send({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}

export async function registerProfileRoutes(app: FastifyInstance, jwtAuth: JwtAuth) {
  app.get('/profile', { preHandler: createAuthMiddleware(jwtAuth) }, getProfileHandler);
}
