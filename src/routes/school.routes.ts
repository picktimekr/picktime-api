import { Router } from 'express';
import {
  createSchoolController,
  getAllSchoolsController,
  getSchoolByIdController,
  updateSchoolController,
  deleteSchoolController,
} from '../controllers/school.controller';

const schoolRouter = Router();

// POST /schools - 학교 생성
schoolRouter.post('/', createSchoolController);

// GET /schools - 전체 학교 조회
schoolRouter.get('/', getAllSchoolsController);

// GET /schools/:id - ID로 학교 상세 조회
schoolRouter.get('/:id', getSchoolByIdController);

// PATCH /schools/:id - ID로 학교 정보 수정
schoolRouter.patch('/:id', updateSchoolController);

// DELETE /schools/:id - ID로 학교 삭제
schoolRouter.delete('/:id', deleteSchoolController);

export default schoolRouter;
