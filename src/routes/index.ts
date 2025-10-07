import { Router, Request, Response, NextFunction } from 'express';
import userRoutes from './user.routes';
import schoolRoutes from './school.routes';
import teacherRoutes from './teacher.routes';
import subjectRoutes from './subject.routes';
import periodRoutes from './period.routes';
import timetableRoutes from './timetable.routes';
import changeRoutes from './change.routes';
import swapRoutes from './swap.routes';
const { MethodNotAllowed } = require('../errors');

const router = Router();

router.use('/users', userRoutes);
router.use('/schools', schoolRoutes);
router.use('/teachers', teacherRoutes);
router.use('/subjects', subjectRoutes);
router.use('/periods', periodRoutes);
router.use('/timetables', timetableRoutes);
router.use('/changes', changeRoutes);
router.use('/swaps', swapRoutes);

// The 405 Handler for unhandled API routes
// This should be the last middleware on this router
router.use((req: Request, res: Response, next: NextFunction) => {
  next(new MethodNotAllowed('API Endpoint Not Found'));
});

export default router;
