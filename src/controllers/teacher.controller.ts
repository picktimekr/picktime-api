import { Request, Response } from 'express';
import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from 'sequelize';
import {
  createTeacher,
  findAllTeachers,
  findTeacherById,
  findTeachersBySchoolId,
  updateTeacher,
  deleteTeacher,
} from '../services/teacher.service';
import { TeacherCreationAttributes } from '../dtos/teacher.dto';
import { sendSuccess, sendError } from '../utils/response';

// 선생님 생성
export const createTeacherController = async (
  req: Request<{}, {}, TeacherCreationAttributes>,
  res: Response
) => {
  try {
    const teacherData = req.body;
    const newTeacher = await createTeacher(teacherData);
    sendSuccess(res, newTeacher, 'Teacher created successfully', 201);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return sendError(
        res,
        'Creation failed: A teacher with the same unique value already exists.',
        409,
        'CONFLICT',
        { fields: error.fields }
      );
    }
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        'Creation failed: The provided school_id does not exist.',
        400,
        'BAD_REQUEST',
        { fields: error.fields }
      );
    }
    sendError(res, 'Failed to create teacher', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 모든 선생님 조회
export const getAllTeachersController = async (req: Request, res: Response) => {
  try {
    const teachers = await findAllTeachers();
    sendSuccess(res, teachers);
  } catch (error) {
    sendError(res, 'Failed to get teachers', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// ID로 선생님 조회
export const getTeacherByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const teacher = await findTeacherById(id);
    if (!teacher) {
      return sendError(res, `Teacher with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, teacher);
  } catch (error) {
    sendError(res, 'Failed to get teacher', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 학교 ID로 선생님 목록 조회
export const getTeachersBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    if (isNaN(schoolId)) {
      return sendError(res, 'Invalid School ID format', 400, 'BAD_REQUEST');
    }
    const teachers = await findTeachersBySchoolId(schoolId);
    sendSuccess(res, teachers);
  } catch (error) {
    sendError(res, 'Failed to get teachers by school', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 선생님 정보 수정
export const updateTeacherController = async (
  req: Request<{ id: string }, {}, Partial<TeacherCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const data = req.body;
    const updatedTeacher = await updateTeacher(id, data);
    if (!updatedTeacher) {
      return sendError(res, `Teacher with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, updatedTeacher, 'Teacher updated successfully');
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return sendError(
        res,
        'Update failed: A teacher with the same unique value already exists.',
        409,
        'CONFLICT',
        { fields: error.fields }
      );
    }
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        'Update failed: The provided school_id does not exist.',
        400,
        'BAD_REQUEST',
        { fields: error.fields }
      );
    }
    sendError(res, 'Failed to update teacher', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 선생님 삭제
export const deleteTeacherController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const deletedRowCount = await deleteTeacher(id);
    if (deletedRowCount === 0) {
      return sendError(res, `Teacher with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, null, 'Teacher deleted successfully', 204);
  } catch (error) {
    sendError(res, 'Failed to delete teacher', 500, 'INTERNAL_SERVER_ERROR');
  }
};

