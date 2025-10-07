import { body } from 'express-validator';

export const validateCreateSingleChange = [
  body('timetable_id').isInt({ min: 1 }).withMessage('Timetable ID must be a positive integer.'),
  body('change_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('Change date must be in YYYY-MM-DD format.'),
  body('new_subject_id').isInt({ min: 1 }).withMessage('New subject ID must be a positive integer.'),
  body('new_teacher_id').isInt({ min: 1 }).withMessage('New teacher ID must be a positive integer.'),
  body('created_by').isInt({ min: 1 }).withMessage('Creator ID must be a positive integer.'),
  body('reason').optional().isString().withMessage('Reason must be a string.'),
];

export const validateCreateSwapChange = [
  body('school_id').isInt({ min: 1 }).withMessage('School ID must be a positive integer.'),
  body('swap_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('Swap date must be in YYYY-MM-DD format.'),
  body('timetable1_id').isInt({ min: 1 }).withMessage('Timetable1 ID must be a positive integer.'),
  body('timetable2_id').isInt({ min: 1 }).withMessage('Timetable2 ID must be a positive integer.'),
  body('created_by').isInt({ min: 1 }).withMessage('Creator ID must be a positive integer.'),
  body('reason').optional().isString().withMessage('Reason must be a string.'),
];
