import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerController } from '../controllers/auth.js';

import { validateBody } from '../utils/validateBody.js';
import { authRegisterSchema } from '../validate/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

export default authRouter;
