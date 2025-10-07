import { Request, Response } from 'express';
import { ForeignKeyConstraintError } from 'sequelize';
import {
  createSingleChange,
  createSwapChange,
} from '../services/change.service';
import {
  SingleChangeCreationAttributes,
  SwapChangeCreationAttributes,
} from '../dtos/change.dto';
import { sendSuccess, sendError } from '../utils/response';

/**
 * 1. 단순 변경(보결) 생성 컨트롤러
 */
export const handleCreateSingleChange = async (
  req: Request<{}, {}, SingleChangeCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newChange = await createSingleChange(data);
    sendSuccess(res, newChange, 'Single change created successfully', 201);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        'Creation failed: Invalid foreign key provided.',
        400,
        'BAD_REQUEST',
        { fields: error.fields }
      );
    }
    sendError(res, 'Failed to create single change', 500, 'INTERNAL_SERVER_ERROR');
  }
};

/**
 * 2. 맞교환 생성 컨트롤러
 */
export const handleCreateSwapChange = async (
  req: Request<{}, {}, SwapChangeCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newSwap = await createSwapChange(data);
    sendSuccess(res, newSwap, 'Swap change created successfully', 201);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        'Creation failed: Invalid foreign key provided.',
        400,
        'BAD_REQUEST',
        { fields: error.fields }
      );
    }
    // 서비스에서 던진 특정 에러 처리
    if (error instanceof Error && error.message.includes('not found')) {
      return sendError(res, error.message, 404, 'NOT_FOUND');
    }
    sendError(res, 'Failed to create swap change', 500, 'INTERNAL_SERVER_ERROR');
  }
};
