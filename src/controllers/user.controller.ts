
// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import * as userService from '../services/user.service';

export const handleGetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const newUser = await userService.createUser(name, email);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        message: "Creation failed: Email already exists.",
        fields: error.fields,
      });
    }
    res.status(500).json({ message: 'Error creating user', error });
  }
};
