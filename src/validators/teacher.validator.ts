import { body } from 'express-validator';

const name = body('name').trim().notEmpty().withMessage('Teacher name is required.');
const school_id = body('school_id').isInt({ min: 1 }).withMessage('school_id must be a positive integer.');
const code = body('code').trim();
const primary_subject_id = body('primary_subject_id').isInt({ min: 1 });
const homeroom_grade = body('homeroom_grade').isInt({ min: 1 });
const homeroom_class = body('homeroom_class').isInt({ min: 1 });

export const validateCreateTeacher = [
  name,
  school_id,
  code.optional(),
  primary_subject_id.optional(),
  homeroom_grade.optional(),
  homeroom_class.optional(),
];

export const validateUpdateTeacher = [
  name.optional(),
  school_id.optional(),
  code.optional(),
  primary_subject_id.optional(),
  homeroom_grade.optional(),
  homeroom_class.optional(),
];
