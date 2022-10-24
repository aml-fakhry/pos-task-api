import { Router } from 'express';

import authService from '../database/auth.service.js';
import { JWT } from '../shared/util/jwt.util.js';

/**
 * The user router that holds all module routes.
 */
export const userRouter = Router();

/**
 * The relative route for the auth.
 */
export const userRelativeRoute = '';

/** Sign up new user. */
userRouter.post('/signup', async (req, res) => {
  const user = await authService.signup(req.body);
  res.send(user);
});

/* Login user. */
userRouter.post('/login', async (req, res) => {
  const user = await authService.login(req.body);

  const jwt = await JWT.genToken(user.id ?? 0);

  res.send({ data: { user: user, token: jwt } });
});
