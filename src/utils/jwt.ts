import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: Role;
}

export const generateToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.verify(token, secret) as JwtPayload;
};
