import { Request, Response } from 'express';
import { ForeignKeyConstraintError } from 'sequelize';
import { createSingleChange, findAllChanges } from '../services/change.service';
import { SingleChangeCreationAttributes } from '../dtos/change.dto';
import { sendSuccess, sendError } from '../utils/response';

/**
 * 모든 단순 변경 조회 컨트롤러
 */
export const handleGetAllChanges = async (req: Request, res: Response) => {
  try {
    const changes = await findAllChanges(req.query);
    sendSuccess(res, changes);
  } catch (error) {
    sendError(res, 'Failed to get changes', 500, 'INTERNAL_SERVER_ERROR', error);
  }
};

/**
 * 단순 변경(보결) 생성 컨트롤러
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

