import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { JwtAuth } from '@infra/auth/JwtAuth';
import { createApp } from '@main/app';

describe('Auth Integration Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await createApp({
      jwtAuth: new JwtAuth(),
      fastifyOptions: {
        logger: false,
      },
    });

    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should check health status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('status', 'ok');
  });

  it('should generate a JWT token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/generate-token',
      payload: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('token');
    expect(body.payload).toEqual({
      email: 'test@example.com',
      name: 'Test User',
    });
  });

  it('should reject generating token with invalid email', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/generate-token',
      payload: {
        email: 'invalid-email',
        name: 'Test User',
      },
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('success', false);
  });

  it('should get profile with valid token', async () => {
    // First, generate a token
    const tokenResponse = await app.inject({
      method: 'POST',
      url: '/auth/generate-token',
      payload: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    const { token } = JSON.parse(tokenResponse.body);

    // Then, use the token to access protected route
    const profileResponse = await app.inject({
      method: 'GET',
      url: '/profile',
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    expect(profileResponse.statusCode).toBe(200);
    const body = JSON.parse(profileResponse.body);
    expect(body).toHaveProperty('success', true);
    expect(body.user).toEqual({
      email: 'test@example.com',
      name: 'Test User',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });

  it('should reject access to protected route without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/profile',
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });

  it('should reject access with invalid token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/profile',
      headers: {
        authorization: 'Bearer invalid-token',
      },
    });

    expect(response.statusCode).toBe(401);
    const body = JSON.parse(response.body);
    expect(body).toHaveProperty('error');
  });
});
