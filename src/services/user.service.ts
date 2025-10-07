
// src/services/user.service.ts
import { User } from '../models';

export const getAllUsers = async () => {
  const users = await User.findAll();
  return users;
};

export const createUser = async (name: string, email: string) => {
  const newUser = await User.create({ name, email });
  return newUser;
};
