import { Router } from 'express';
import {
  createPeriodController,
  getAllPeriodsController,
  getPeriodByIdController,
  updatePeriodController,
  deletePeriodController,
} from '../controllers/period.controller';

const periodRouter = Router();

// POST /periods - 교시 생성
periodRouter.post('/', createPeriodController);

// GET /periods - 전체 교시 조회
periodRouter.get('/', getAllPeriodsController);

// GET /periods/:id - ID로 교시 상세 조회
periodRouter.get('/:id', getPeriodByIdController);

// PATCH /periods/:id - ID로 교시 정보 수정
periodRouter.patch('/:id', updatePeriodController);

// DELETE /periods/:id - ID로 교시 삭제
periodRouter.delete('/:id', deletePeriodController);

export default periodRouter;
