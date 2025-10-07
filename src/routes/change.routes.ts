import { Router } from 'express';
import { handleGetAllChanges, handleCreateSingleChange } from '../controllers/change.controller';
import { validateCreateSingleChange } from '../validators/change.validator';
import { handleValidationErrors } from '../middlewares/validator.middleware';
import { isAuthenticated } from '../middlewares/auth.middleware';

const changeRouter = Router();

/**
 * @route   GET /changes
 * @desc    단순 변경 조회
 * @access  Private
 */
changeRouter.get('/', isAuthenticated, handleGetAllChanges);

/**
 * @route   POST /changes
 * @desc    단순 변경(보결) 생성
 * @access  Private
 */
changeRouter.post(
  '/',
  isAuthenticated,
  validateCreateSingleChange,
  handleValidationErrors,
  handleCreateSingleChange
);

export default changeRouter;
