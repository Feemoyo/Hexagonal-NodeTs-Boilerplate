import jwt from 'jsonwebtoken';
import { IAuthPort } from '@domain/ports/IAuthPort';
import { config } from '@config/env';

export class JwtAuth implements IAuthPort {
  generateToken(payload: Record<string, any>): string {
    return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
  }

  verifyToken(token: string): Record<string, any> {
    try {
      return jwt.verify(token, config.JWT_SECRET) as Record<string, any>;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
