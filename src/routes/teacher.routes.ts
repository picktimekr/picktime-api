import { Router } from 'express';
import {
  createTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherController,
  deleteTeacherController,
} from '../controllers/teacher.controller';
import { handleValidationErrors } from '../middlewares/validator.middleware';
import {
  validateCreateTeacher,
  validateUpdateTeacher,
} from '../validators/teacher.validator';

import { isAuthenticated } from '../middlewares/auth.middleware';

const teacherRouter = Router();

// POST /teachers - 선생님 생성
teacherRouter.post('/', isAuthenticated, validateCreateTeacher, handleValidationErrors, createTeacherController);

// GET /teachers - 전체 선생님 조회
teacherRouter.get('/', getAllTeachersController);

// GET /teachers/:id - ID로 선생님 상세 조회
teacherRouter.get('/:id', getTeacherByIdController);

// PATCH /teachers/:id - ID로 선생님 정보 수정
teacherRouter.patch(
  '/:id',
  isAuthenticated,
  validateUpdateTeacher,
  handleValidationErrors,
  updateTeacherController
);

// DELETE /teachers/:id - ID로 선생님 삭제
teacherRouter.delete('/:id', isAuthenticated, deleteTeacherController);

export default teacherRouter;
