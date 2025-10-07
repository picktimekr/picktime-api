import { Request, Response } from 'express';
import { ForeignKeyConstraintError } from 'sequelize';
import {
  createPeriod,
  findAllPeriods,
  findPeriodById,
  findPeriodsBySchoolId,
  updatePeriod,
  deletePeriod,
} from '../services/period.service';
import { PeriodCreationAttributes } from '../dtos/period.dto';
import { sendSuccess, sendError } from '../utils/response';

// 교시 생성
export const createPeriodController = async (
  req: Request<{}, {}, PeriodCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newPeriod = await createPeriod(data);
    sendSuccess(res, newPeriod, 'Period created successfully', 201);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        "Creation failed: The provided school_id does not exist.",
        400,
        "BAD_REQUEST"
      );
    }
    sendError(res, 'Failed to create period', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 모든 교시 조회
export const getAllPeriodsController = async (req: Request, res: Response) => {
  try {
    const periods = await findAllPeriods();
    sendSuccess(res, periods);
  } catch (error) {
    sendError(res, 'Failed to get periods', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// ID로 교시 조회
export const getPeriodByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const period = await findPeriodById(id);
    if (!period) {
      return sendError(res, `Period with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, period);
  } catch (error) {
    sendError(res, 'Failed to get period', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 학교 ID로 교시 목록 조회
export const getPeriodsBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    if (isNaN(schoolId)) {
      return sendError(res, 'Invalid School ID format', 400, 'BAD_REQUEST');
    }
    const periods = await findPeriodsBySchoolId(schoolId);
    sendSuccess(res, periods);
  } catch (error) {
    sendError(res, 'Failed to get periods by school', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 교시 정보 수정
export const updatePeriodController = async (
  req: Request<{ id: string }, {}, Partial<PeriodCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const data = req.body;
    const updatedPeriod = await updatePeriod(id, data);
    if (!updatedPeriod) {
      return sendError(res, `Period with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, updatedPeriod, 'Period updated successfully');
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        "Update failed: The provided school_id does not exist.",
        400,
        "BAD_REQUEST"
      );
    }
    sendError(res, 'Failed to update period', 500, 'INTERNAL_SERVER_ERROR');
  }
};

// 교시 삭제
export const deletePeriodController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return sendError(res, 'Invalid ID format', 400, 'BAD_REQUEST');
    }
    const deletedRowCount = await deletePeriod(id);
    if (deletedRowCount === 0) {
      return sendError(res, `Period with id ${id} not found`, 404, 'NOT_FOUND');
    }
    sendSuccess(res, null, 'Period deleted successfully', 204);
  } catch (error) {
    sendError(res, 'Failed to delete period', 500, 'INTERNAL_SERVER_ERROR');
  }
};
