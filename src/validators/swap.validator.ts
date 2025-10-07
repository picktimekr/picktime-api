import { body } from 'express-validator';

export const validateCreateSwap = [
  body('school_id').isInt({ min: 1 }).withMessage('School ID must be a positive integer.'),
  body('swap_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('Swap date must be in YYYY-MM-DD format.'),
  body('timetable1_id').isInt({ min: 1 }).withMessage('Timetable1 ID must be a positive integer.'),
  body('timetable2_id').isInt({ min: 1 }).withMessage('Timetable2 ID must be a positive integer.'),
  body('created_by').isInt({ min: 1 }).withMessage('Creator ID must be a positive integer.'),
];
