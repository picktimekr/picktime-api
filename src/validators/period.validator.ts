import { body } from 'express-validator';

const school_id = body('school_id').isInt({ min: 1 }).withMessage('school_id must be a positive integer.');
const weekday = body('weekday').isInt({ min: 1, max: 7 }).withMessage('Weekday must be an integer between 1 and 7.');
const period_number = body('period_number').isInt({ min: 1 }).withMessage('Period number must be a positive integer.');
const start_time = body('start_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('start_time must be in HH:mm:ss format.');
const end_time = body('end_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('end_time must be in HH:mm:ss format.');

export const validateCreatePeriod = [
  school_id,
  weekday,
  period_number,
  start_time,
  end_time,
];

export const validateUpdatePeriod = [
  school_id.optional(),
  weekday.optional(),
  period_number.optional(),
  start_time.optional(),
  end_time.optional(),
];
