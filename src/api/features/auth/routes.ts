import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { JwtAuth } from '@infra/auth/JwtAuth';

const generateTokenSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(1, 'Nome é obrigatório'),
});

function buildGenerateTokenHandler(jwtAuth: JwtAuth) {
  return async function generateToken(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = generateTokenSchema.parse(request.body);

      const token = jwtAuth.generateToken({
        email: body.email,
        name: body.name,
        iat: Math.floor(Date.now() / 1000),
      });

      return reply.status(200).send({
        success: true,
        token,
        payload: {
          email: body.email,
          name: body.name,
        },
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        error: error.message || 'Invalid request',
      });
    }
  };
}

export async function registerAuthRoutes(app: FastifyInstance, jwtAuth: JwtAuth) {
  app.post('/auth/generate-token', buildGenerateTokenHandler(jwtAuth));
}
