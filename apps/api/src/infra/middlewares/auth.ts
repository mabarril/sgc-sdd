import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Token de autenticação ausente');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedError('Token malformatado');
  }

  const token = parts[1];
  const jwtSecret = process.env.JWT_SECRET || 'desbravadores-super-secret-key-12345';

  try {
    const decoded = jwt.verify(token, jwtSecret) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    return next();
  } catch (err) {
    throw new UnauthorizedError('Token inválido ou expirado');
  }
}
