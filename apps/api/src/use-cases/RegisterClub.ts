import { z } from 'zod';
import prisma from '../infra/db';
import { ConflictError, ValidationError, NotFoundError } from '../infra/errors';

export const RegisterClubSchema = z.object({
  name: z.string().min(2, 'O nome do clube deve ter pelo menos 2 caracteres'),
  association: z.string().min(2, 'A associação deve ter pelo menos 2 caracteres'),
  localChurch: z.string().min(2, 'A igreja local deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'A cidade deve ter pelo menos 2 caracteres'),
  state: z.string().length(2, 'O estado deve ter exatamente 2 caracteres (UF)'),
  foundingDate: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime()) && date <= new Date();
  }, {
    message: 'A data de fundação deve ser uma data válida e não pode ser no futuro',
  }),
});

export type RegisterClubInput = z.infer<typeof RegisterClubSchema>;

export class RegisterClubUseCase {
  async execute(input: RegisterClubInput, directorId: string) {
    const validation = RegisterClubSchema.safeParse(input);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map(e => e.message).join(', ');
      throw new ValidationError(errorMsg);
    }

    const { name, association, localChurch, city, state, foundingDate } = validation.data;

    // Check if director user exists
    const user = await prisma.user.findUnique({
      where: { id: directorId },
      include: { managedClub: true },
    });

    if (!user) {
      throw new NotFoundError('Administrador do clube não encontrado');
    }

    // Check if user already manages a club
    if (user.managedClub) {
      throw new ConflictError('Este administrador já possui um clube cadastrado');
    }

    // Check if club name is unique
    const existingClub = await prisma.club.findUnique({
      where: { name },
    });

    if (existingClub) {
      throw new ConflictError('O nome do clube já está cadastrado');
    }

    // Generate unique club code CLB-XXXXXX
    let uniqueCode = '';
    let isCodeUnique = false;

    while (!isCodeUnique) {
      const randomDigits = Math.floor(100000 + Math.random() * 900000).toString();
      uniqueCode = `CLB-${randomDigits}`;

      const codeExists = await prisma.club.findUnique({
        where: { uniqueCode },
      });

      if (!codeExists) {
        isCodeUnique = true;
      }
    }

    // Create the club
    const club = await prisma.club.create({
      data: {
        name,
        association,
        localChurch,
        city,
        state,
        foundingDate: new Date(foundingDate),
        uniqueCode,
        directorId,
      },
    });

    return club;
  }
}
