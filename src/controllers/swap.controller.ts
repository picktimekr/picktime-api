import { Request, Response } from 'express';
import { ForeignKeyConstraintError } from 'sequelize';
import { createSwap, findAllSwaps } from '../services/swap.service';
import { SwapCreationAttributes } from '../dtos/swap.dto';
import { sendSuccess, sendError } from '../utils/response';

export const handleGetAllSwaps = async (req: Request, res: Response) => {
  try {
    const swaps = await findAllSwaps(req.query);
    sendSuccess(res, swaps);
  } catch (error) {
    sendError(res, 'Failed to get swaps', 500, 'INTERNAL_SERVER_ERROR', error);
  }
};

export const handleCreateSwap = async (
  req: Request<{}, {}, SwapCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newSwap = await createSwap(data);
    sendSuccess(res, newSwap, 'Swap created successfully', 201);
  } catch (error) {
    // 데이터베이스 외래 키 제약조건 위반 시
    if (error instanceof ForeignKeyConstraintError) {
      return sendError(
        res,
        'Creation failed: Invalid foreign key provided.',
        400,
        'BAD_REQUEST',
        { fields: error.fields }
      );
    }
    // 서비스 로직에서 발생시킨 일반 에러 (예: 자기 자신과 맞교환)
    if (error instanceof Error) {
        return sendError(res, error.message, 400, 'BAD_REQUEST');
    }
    // 그 외 알 수 없는 에러
    sendError(res, 'Failed to create swap', 500, 'INTERNAL_SERVER_ERROR', error);
  }
};