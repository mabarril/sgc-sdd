import { Router, Response, NextFunction } from 'express';
import { RegisterClubUseCase } from '../../use-cases/RegisterClub';
import { authMiddleware, AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../db';
import { NotFoundError } from '../errors';

const clubRouter = Router();
const registerClub = new RegisterClubUseCase();

// POST /api/clubs - Register a new club
clubRouter.post('/', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const directorId = req.user?.userId;
    if (!directorId) {
      return res.status(401).json({ error: 'Diretor não autenticado' });
    }

    const club = await registerClub.execute(req.body, directorId);
    return res.status(201).json(club);
  } catch (error) {
    return next(error);
  }
});

// GET /api/clubs/me - Get current user's registered club details
clubRouter.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const directorId = req.user?.userId;
    if (!directorId) {
      return res.status(401).json({ error: 'Diretor não autenticado' });
    }

    const club = await prisma.club.findUnique({
      where: { directorId },
    });

    if (!club) {
      throw new NotFoundError('Nenhum clube cadastrado para este administrador');
    }

    return res.status(200).json(club);
  } catch (error) {
    return next(error);
  }
});

export default clubRouter;
