import { Router } from 'express';
import { RegisterUserUseCase } from '../../use-cases/RegisterUser';
import { LoginUserUseCase } from '../../use-cases/LoginUser';

const authRouter = Router();
const registerUser = new RegisterUserUseCase();
const loginUser = new LoginUserUseCase();

authRouter.post('/register', async (req, res, next) => {
  try {
    const user = await registerUser.execute(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/login', async (req, res, next) => {
  try {
    const result = await loginUser.execute(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

export default authRouter;
