import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '../infra/db';
import { ConflictError, ValidationError } from '../infra/errors';

export const RegisterUserSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;

export class RegisterUserUseCase {
  async execute(input: RegisterUserInput) {
    const validation = RegisterUserSchema.safeParse(input);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(e => e.message).join(', ');
      throw new ValidationError(errorMsg);
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'ADMIN_CLUB', // Default role for club setup
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
