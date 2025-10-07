
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import * as userService from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';

export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, users);
  } catch (error) {
    sendError(res, 'Failed to get users', 500, 'INTERNAL_SERVER_ERROR', error);
  }
};

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return sendError(res, 'Name and email are required', 400, 'BAD_REQUEST');
    }
    const newUser = await userService.createUser(name, email);
    sendSuccess(res, newUser, 'User created successfully', 201);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return sendError(
        res,
        'Creation failed: Email already exists.',
        409,
        'CONFLICT',
        { fields: error.fields }
      );
    }
    sendError(res, 'Failed to create user', 500, 'INTERNAL_SERVER_ERROR');
  }
};
