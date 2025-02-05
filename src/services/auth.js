import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import User from '../db/models/User.js';

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
