import { Router } from 'express';
import {
  createTimetableController,
  getAllTimetablesController,
  getTimetableByIdController,
  updateTimetableController,
  deleteTimetableController,
} from '../controllers/timetable.controller';

const timetableRouter = Router();

// POST /timetables - 시간표 항목 생성
timetableRouter.post('/', createTimetableController);

// GET /timetables - 전체 시간표 항목 조회
timetableRouter.get('/', getAllTimetablesController);

// GET /timetables/:id - ID로 시간표 항목 상세 조회
timetableRouter.get('/:id', getTimetableByIdController);

// PATCH /timetables/:id - ID로 시간표 항목 정보 수정
timetableRouter.patch('/:id', updateTimetableController);

// DELETE /timetables/:id - ID로 시간표 항목 삭제
timetableRouter.delete('/:id', deleteTimetableController);

export default timetableRouter;
