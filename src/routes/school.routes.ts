import { Router } from 'express';
import {
  createSchoolController,
  getAllSchoolsController,
  getSchoolByIdController,
  updateSchoolController,
  deleteSchoolController,
} from '../controllers/school.controller';
import { getTeachersBySchoolIdController } from '../controllers/teacher.controller';
import { getSubjectsBySchoolIdController } from '../controllers/subject.controller';
import { getPeriodsBySchoolIdController } from '../controllers/period.controller';

const schoolRouter = Router();

// POST /schools - 학교 생성
schoolRouter.post('/', createSchoolController);

// GET /schools - 전체 학교 조회
schoolRouter.get('/', getAllSchoolsController);

// GET /schools/:id - ID로 학교 상세 조회
schoolRouter.get('/:id', getSchoolByIdController);

// GET /schools/:schoolId/teachers - 특정 학교의 모든 선생님 조회
schoolRouter.get('/:schoolId/teachers', getTeachersBySchoolIdController);

// GET /schools/:schoolId/subjects - 특정 학교의 모든 과목 조회
schoolRouter.get('/:schoolId/subjects', getSubjectsBySchoolIdController);

// GET /schools/:schoolId/periods - 특정 학교의 모든 교시 조회
schoolRouter.get('/:schoolId/periods', getPeriodsBySchoolIdController);

// PATCH /schools/:id - ID로 학교 정보 수정
schoolRouter.patch('/:id', updateSchoolController);

// DELETE /schools/:id - ID로 학교 삭제
schoolRouter.delete('/:id', deleteSchoolController);

export default schoolRouter;
