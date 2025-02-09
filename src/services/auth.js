import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import User from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import {
  accessTokenValidUntil,
  refreshTokenValidUntil,
} from '../constants/users.js';

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...payload, password: hashPassword });

  return newUser;
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // delete prev session if it exists
  await SessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenValidUntil,
    refreshTokenValidUntil: Date.now() + refreshTokenValidUntil,
  });
};
