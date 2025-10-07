import { Router } from 'express';
import {
  handleCreateSingleChange,
  handleCreateSwapChange,
} from '../controllers/change.controller';
import {
  validateCreateSingleChange,
  validateCreateSwapChange,
} from '../validators/change.validator';
import { handleValidationErrors } from '../middlewares/validator.middleware';
import { isAuthenticated } from '../middlewares/auth.middleware';

const changeRouter = Router();

/**
 * @route   POST /changes/single
 * @desc    단순 변경(보결) 생성
 * @access  Private
 */
changeRouter.post(
  '/single',
  isAuthenticated,
  validateCreateSingleChange,
  handleValidationErrors,
  handleCreateSingleChange
);

/**
 * @route   POST /changes/swap
 * @desc    맞교환 생성
 * @access  Private
 */
changeRouter.post(
  '/swap',
  isAuthenticated,
  validateCreateSwapChange,
  handleValidationErrors,
  handleCreateSwapChange
);

export default changeRouter;
