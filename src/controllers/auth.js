// import { refreshTokenValidUntil } from '../constants/users.js';
import * as authServices from '../services/auth.js';
import { resetPassword } from '../services/auth.js';

const setupSession = (res, session) => {
  // refreshToken, sessionId передаємо та зберігаємо в http-кукі
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};

export const registerController = async (req, res) => {
  const user = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  // refreshToken, sessionId передаємо та зберігаємо в http-кукі
  setupSession(res, session);

  // a accessToken передаємо в тілі відповіді
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await authServices.refreshToken({ refreshToken, sessionId });

  // refreshToken, sessionId передаємо та зберігаємо в http-кукі
  setupSession(res, session);

  // a accessToken передаємо в тілі відповіді
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await authServices.logout(req.cookies.sessionId);
  }

  // чистимо кукі
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await authServices.requestResetToken(req.body.email);

  res.json({
    message: 'Reset password email was successfully sent',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};
