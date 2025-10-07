import { body } from 'express-validator';

const name = body('name').trim().notEmpty().withMessage('School name is required.');
const code = body('code').trim().notEmpty().withMessage('School code is required.');
const region = body('region').trim().notEmpty().withMessage('Region is required.');
const type = body('type').trim().notEmpty().withMessage('School type is required.');
const max_grade = body('max_grade').isInt({ min: 1 }).withMessage('Max grade must be a positive integer.');
const max_real_class = body('max_real_class').isInt({ min: 1 }).withMessage('Max real class must be a positive integer.');
const max_virtual_class = body('max_virtual_class').isInt({ min: 0 }).withMessage('Max virtual class must be a non-negative integer.');

export const validateCreateSchool = [
  name,
  code,
  region,
  type,
  max_grade,
  max_real_class,
  max_virtual_class,
];

export const validateUpdateSchool = [
  name.optional(),
  code.optional(),
  region.optional(),
  type.optional(),
  max_grade.optional(),
  max_real_class.optional(),
  max_virtual_class.optional(),
];
