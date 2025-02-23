import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import UsersCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import {
  accessTokenValidUntil,
  refreshTokenValidUntil,
} from '../constants/users.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';

const createSessionData = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: Date.now() + accessTokenValidUntil,
  refreshTokenValidUntil: Date.now() + refreshTokenValidUntil,
});

export const register = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });

  return newUser;
};

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password invalid');
  }

  const isEqualPass = await bcrypt.compare(password, user.password);
  if (!isEqualPass) {
    throw createHttpError(401, 'Email or password invalid');
  }

  // delete prev session if it exists
  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });
};

export const refreshToken = async (payload) => {
  const oldSession = await SessionCollection.findOne({
    _id: payload.sessionId,
    refreshToken: payload.refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionCollection.deleteOne({ _id: payload.sessionId });

  const sessionData = createSessionData();

  return SessionCollection.create({
    userId: oldSession.userId,
    ...sessionData,
  });
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const getSession = (filter) => SessionCollection.findOne(filter);

export const getUser = (filter) => UsersCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  // console.log('services - email: ', email); // sokolov@meta.ua

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  console.log('services - user', user);

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );
  // console.log('resetToken: ', resetToken); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2N2IzYjRmYTU2ZmQzYjg1NjU0NmE4ZmQiLCJlbWFpbCI6InNva29sb3ZAbWV0YS51YSIsImlhdCI6MTc0MDE3NDIzOSwiZXhwIjoxNzQwMTc1MTM5fQ.WQRCSW9uT00AQMRWuU1pb73UAzUSDTmLL_yZv47TQYU

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    // if (err instanceof Error) throw createHttpError(401, err.message);
    // throw err;
    console.log(err.message);
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await UsersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
