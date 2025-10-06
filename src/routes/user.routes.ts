
// src/routes/user.routes.ts
import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.handleGetAllUsers);
router.post('/', userController.handleCreateUser);

export default router;
