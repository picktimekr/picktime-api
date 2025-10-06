import { Router, Request, Response, NextFunction } from 'express';
import userRoutes from './user.routes';
import schoolRoutes from './school.routes'
const { NotFoundError, MethodNotAllowed } = require('../errors');

const router = Router();

router.use('/users', userRoutes);
router.use('/schools', schoolRoutes);

// The 405 Handler for unhandled API routes
// This should be the last middleware on this router
router.use((req: Request, res: Response, next: NextFunction) => {
  next(new MethodNotAllowed('API Endpoint Not Found'));
});

export default router;
