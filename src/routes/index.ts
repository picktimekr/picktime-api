import { Router, Request, Response, NextFunction } from 'express';
import userRoutes from './user.routes';
const { NotFoundError, MethodNotAllowed } = require('../errors');

const router = Router();

router.use('/users', userRoutes);

// Test route for 405 Method Not Allowed
router.all('/test-method', (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET') {
    return next(new MethodNotAllowed());
  }
  // If it's a GET request, send a success response
  res.status(200).send('GET request successful');
});

// The 405 Handler for unhandled API routes
// This should be the last middleware on this router
router.use((req: Request, res: Response, next: NextFunction) => {
  next(new MethodNotAllowed('API Endpoint Not Found'));
});

export default router;
