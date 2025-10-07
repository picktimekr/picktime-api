import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import {
  createSchool,
  findAllSchools,
  findSchoolById,
  updateSchool,
  deleteSchool,
} from '../services/school.service';
import { SchoolCreationAttributes } from '../dtos/school.dto';
import { sendSuccess, sendError } from '../utils/response';

// 학교 생성 컨트롤러
export const createSchoolController = async (
  req: Request<{}, {}, SchoolCreationAttributes>,
  res: Response
) => {
  try {
    const schoolData = req.body;
    const newSchool = await createSchool(schoolData);
    sendSuccess(res, newSchool, 'School created successfully', 201);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return sendError(
        res,
        "Creation failed: School code already exists.",
        409,
        "CONFLICT",
        { fields: error.fields }
      );
    }
    sendError(res, 'Failed to create school', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 전체 학교 조회 컨트롤러
export const getAllSchoolsController = async (req: Request, res: Response) => {
  try {
    const schools = await findAllSchools();
    sendSuccess(res, schools);
  } catch (error) {
    sendError(res, 'Failed to get schools', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// ID로 학교 상세 조회 컨트롤러
export const getSchoolByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }

    const school = await findSchoolById(id);

    if (!school) {
      return sendError(res, `School with id ${id} not found`, 404, 'NOT_FOUND');
    }

    sendSuccess(res, school);
  } catch (error) {
    sendError(res, 'Failed to get school', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 학교 정보 수정 컨트롤러
export const updateSchoolController = async (
  req: Request<{ id: string }, {}, Partial<SchoolCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }

    const data = req.body;
    const updatedSchool = await updateSchool(id, data);

    if (!updatedSchool) {
      return sendError(res, `School with id ${id} not found`, 404, 'NOT_FOUND');
    }

    sendSuccess(res, updatedSchool, 'School updated successfully');
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return sendError(
        res,
        "Update failed: School code already exists.",
        409,
        "CONFLICT",
        { fields: error.fields }
      );
    }
    sendError(res, 'Failed to update school', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 학교 삭제 컨트롤러
export const deleteSchoolController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }

    const deletedRowCount = await deleteSchool(id);

    if (deletedRowCount === 0) {
      return sendError(res, `School with id ${id} not found`, 404, 'NOT_FOUND');
    }

    sendSuccess(res, null, 'School deleted successfully', 204);
  } catch (error) {
    sendError(res, 'Failed to delete school', 500, 'INTERNAL_SERVER_ERROR');
  }
};