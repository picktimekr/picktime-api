import { body } from 'express-validator';

const school_id = body('school_id').isInt({ min: 1 }).withMessage('school_id must be a positive integer.');
const name = body('name').trim().notEmpty().withMessage('Subject name is required.');
const short_name = body('short_name').trim().notEmpty().withMessage('Short name is required.');
const code = body('code').trim();

export const validateCreateSubject = [
  school_id,
  name,
  short_name,
  code.optional(),
];

export const validateUpdateSubject = [
  school_id.optional(),
  name.optional(),
  short_name.optional(),
  code.optional(),
];
