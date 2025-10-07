import { Router } from 'express';
import { handleCreateSwap, handleGetAllSwaps } from '../controllers/swap.controller';
import { validateCreateSwap } from '../validators/swap.validator';
import { handleValidationErrors } from '../middlewares/validator.middleware';
import { isAuthenticated } from '../middlewares/auth.middleware';

const swapRouter = Router();

/**
 * @route   GET /swaps
 * @desc    맞교환 조회
 * @access  Private
 */
swapRouter.get('/', isAuthenticated, handleGetAllSwaps);

/**
 * @route   POST /swaps
 * @desc    맞교환 생성
 * @access  Private
 */
swapRouter.post(
  '/',
  isAuthenticated,
  validateCreateSwap,
  handleValidationErrors,
  handleCreateSwap
);

export default swapRouter;
