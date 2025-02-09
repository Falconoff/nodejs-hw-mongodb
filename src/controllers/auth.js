// import { refreshTokenValidUntil } from '../constants/users.js';
import * as authServices from '../services/auth.js';

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
  // console.log(session);

  // refreshToken передаємо та зберігаємо в http-кукі
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  // a accessToken передаємо в тілі відповіді
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
