import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../infra/db';
import { UnauthorizedError, ValidationError } from '../infra/errors';

export const LoginUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'A senha é obrigatória'),
});

export type LoginUserInput = z.infer<typeof LoginUserSchema>;

export class LoginUserUseCase {
  async execute(input: LoginUserInput) {
    const validation = LoginUserSchema.safeParse(input);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(e => e.message).join(', ');
      throw new ValidationError(errorMsg);
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('E-mail ou senha incorretos');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('E-mail ou senha incorretos');
    }

    const jwtSecret = process.env.JWT_SECRET || 'desbravadores-super-secret-key-12345';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
