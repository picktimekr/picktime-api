import { Router } from 'express';
import {
  createTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherController,
  deleteTeacherController,
} from '../controllers/teacher.controller';

const teacherRouter = Router();

// POST /teachers - 선생님 생성
teacherRouter.post('/', createTeacherController);

// GET /teachers - 전체 선생님 조회
teacherRouter.get('/', getAllTeachersController);

// GET /teachers/:id - ID로 선생님 상세 조회
teacherRouter.get('/:id', getTeacherByIdController);

// PATCH /teachers/:id - ID로 선생님 정보 수정
teacherRouter.patch('/:id', updateTeacherController);

// DELETE /teachers/:id - ID로 선생님 삭제
teacherRouter.delete('/:id', deleteTeacherController);

export default teacherRouter;
