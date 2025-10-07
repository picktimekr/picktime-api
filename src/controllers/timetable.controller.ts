import { Request, Response } from 'express';
import { ForeignKeyConstraintError } from 'sequelize';
import {
  createTimetable,
  findAllTimetables,
  findTimetableById,
  findTimetablesByClass,
  updateTimetable,
  deleteTimetable,
} from '../services/timetable.service';
import { TimetableCreationAttributes } from '../dtos/timetable.dto';
import { sendSuccess, sendError } from '../utils/response';

// 시간표 항목 생성
export const createTimetableController = async (
  req: Request<{}, {}, TimetableCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newTimetable = await createTimetable(data);
    sendSuccess(res, newTimetable, 'Timetable entry created successfully', 201);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        "Creation failed: Invalid foreign key.",
        400,
        "BAD_REQUEST",
        {
          error: `The provided school_id, subject_id, or teacher_id does not exist.`,
        }
      );
    }
    sendError(res, 'Failed to create timetable entry', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 모든 시간표 항목 조회
export const getAllTimetablesController = async (req: Request, res: Response) => {
  try {
    const timetables = await findAllTimetables();
    sendSuccess(res, timetables);
  } catch (error) {
    sendError(res, 'Failed to get timetable entries', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// ID로 시간표 항목 조회
export const getTimetableByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const timetable = await findTimetableById(id);
    if (!timetable) {
      return sendError(res, `Timetable entry with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, timetable);
  } catch (error) {
    sendError(res, 'Failed to get timetable entry', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 특정 학급의 시간표 조회
export const getTimetablesByClassController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    const grade = parseInt(req.params.grade, 10);
    const classNumber = parseInt(req.params.classNumber, 10);

    if (isNaN(schoolId) || isNaN(grade) || isNaN(classNumber)) {
      return sendError(res, 'Invalid ID format for school, grade, or class number', 400, 'BAD_REQUEST');
    }
    const timetables = await findTimetablesByClass(schoolId, grade, classNumber);
    sendSuccess(res, timetables);
  } catch (error) {
    sendError(res, 'Failed to get timetables by class', 500, 'INTERNAL_SERVER_ERROR');
  }
};


// 시간표 항목 정보 수정
export const updateTimetableController = async (
  req: Request<{ id: string }, {}, Partial<TimetableCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const data = req.body;
    const updatedTimetable = await updateTimetable(id, data);
    if (!updatedTimetable) {
      return sendError(res, `Timetable entry with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, updatedTimetable, 'Timetable entry updated successfully');
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        "Update failed: Invalid foreign key.",
        400,
        "BAD_REQUEST",
        {
          error: `The provided school_id, subject_id, or teacher_id does not exist.`,
        }
      );
    }
    sendError(res, 'Failed to update timetable entry', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 시간표 항목 삭제
export const deleteTimetableController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const deletedRowCount = await deleteTimetable(id);
    if (deletedRowCount === 0) {
      return sendError(res, `Timetable entry with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, null, 'Timetable entry deleted successfully', 204);
  } catch (error) {
    sendError(res, 'Failed to delete timetable entry', 500, 'INTERNAL_SERVER_ERROR');
  }
};
