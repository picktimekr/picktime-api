import { Request, Response } from 'express';
import {
  ForeignKeyConstraintError,
} from 'sequelize';
import {
  createSubject,
  findAllSubjects,
  findSubjectById,
  findSubjectsBySchoolId,
  updateSubject,
  deleteSubject,
} from '../services/subject.service';
import { SubjectCreationAttributes } from '../dtos/subject.dto';
import { sendSuccess, sendError } from '../utils/response';

// 과목 생성
export const createSubjectController = async (
  req: Request<{}, {}, SubjectCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newSubject = await createSubject(data);
    sendSuccess(res, newSubject, 'Subject created successfully', 201);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        "Creation failed: The provided school_id does not exist.",
        400,
        "BAD_REQUEST"
      );
    }
    sendError(res, 'Failed to create subject', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 모든 과목 조회
export const getAllSubjectsController = async (req: Request, res: Response) => {
  try {
    const subjects = await findAllSubjects();
    sendSuccess(res, subjects);
  } catch (error) {
    sendError(res, 'Failed to get subjects', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// ID로 과목 조회
export const getSubjectByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const subject = await findSubjectById(id);
    if (!subject) {
      return sendError(res, `Subject with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, subject);
  } catch (error) {
    sendError(res, 'Failed to get subject', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 학교 ID로 과목 목록 조회
export const getSubjectsBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    if (isNaN(schoolId)) {
      return sendError(res, 'Invalid School ID format', 400, 'BAD_REQUEST');
    }
    const subjects = await findSubjectsBySchoolId(schoolId);
    sendSuccess(res, subjects);
  } catch (error) {
    sendError(res, 'Failed to get subjects by school', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 과목 정보 수정
export const updateSubjectController = async (
  req: Request<{ id: string }, {}, Partial<SubjectCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const data = req.body;
    const updatedSubject = await updateSubject(id, data);
    if (!updatedSubject) {
      return sendError(res, `Subject with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, updatedSubject, 'Subject updated successfully');
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        "Update failed: The provided school_id does not exist.",
        400,
        "BAD_REQUEST"
      );
    }
    sendError(res, 'Failed to update subject', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 과목 삭제
export const deleteSubjectController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const deletedRowCount = await deleteSubject(id);
    if (deletedRowCount === 0) {
      return sendError(res, `Subject with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, null, 'Subject deleted successfully', 204);
  } catch (error) {
    sendError(res, 'Failed to delete subject', 500, 'INTERNAL_SERVER_ERROR');
  }
};
