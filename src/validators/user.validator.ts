import { body } from 'express-validator';

export const validateCreateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.'),
  body('email')
    .isEmail()
    .withMessage('A valid email is required.'),
];
