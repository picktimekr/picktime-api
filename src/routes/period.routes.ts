import { Router } from 'express';
import {
  createPeriodController,
  getAllPeriodsController,
  getPeriodByIdController,
  updatePeriodController,
  deletePeriodController,
} from '../controllers/period.controller';
import { handleValidationErrors } from '../middlewares/validator.middleware';
import {
  validateCreatePeriod,
  validateUpdatePeriod,
} from '../validators/period.validator';

import { isAuthenticated } from '../middlewares/auth.middleware';

const periodRouter = Router();

// POST /periods - 교시 생성
periodRouter.post('/', isAuthenticated, validateCreatePeriod, handleValidationErrors, createPeriodController);

// GET /periods - 전체 교시 조회
periodRouter.get('/', getAllPeriodsController);

// GET /periods/:id - ID로 교시 상세 조회
periodRouter.get('/:id', getPeriodByIdController);

// PATCH /periods/:id - ID로 교시 정보 수정
periodRouter.patch('/:id', isAuthenticated, validateUpdatePeriod, handleValidationErrors, updatePeriodController);

// DELETE /periods/:id - ID로 교시 삭제
periodRouter.delete('/:id', isAuthenticated, deletePeriodController);

export default periodRouter;
