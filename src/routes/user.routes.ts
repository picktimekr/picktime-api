
// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { validateCreateUser } from '../validators/user.validator';
import { handleValidationErrors } from '../middlewares/validator.middleware';
import { isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', userController.handleGetAllUsers);

router.post(
  '/',
  isAuthenticated, // 인증 미들웨어 추가
  validateCreateUser,
  handleValidationErrors,
  userController.handleCreateUser
);

export default router;
