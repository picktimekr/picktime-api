import { Router } from 'express';
import {
  createSubjectController,
  getAllSubjectsController,
  getSubjectByIdController,
  updateSubjectController,
  deleteSubjectController,
} from '../controllers/subject.controller';

const subjectRouter = Router();

// POST /subjects - 과목 생성
subjectRouter.post('/', createSubjectController);

// GET /subjects - 전체 과목 조회
subjectRouter.get('/', getAllSubjectsController);

// GET /subjects/:id - ID로 과목 상세 조회
subjectRouter.get('/:id', getSubjectByIdController);

// PATCH /subjects/:id - ID로 과목 정보 수정
subjectRouter.patch('/:id', updateSubjectController);

// DELETE /subjects/:id - ID로 과목 삭제
subjectRouter.delete('/:id', deleteSubjectController);

export default subjectRouter;
