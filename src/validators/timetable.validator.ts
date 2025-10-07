import { body } from 'express-validator';

const school_id = body('school_id').isInt({ min: 1 });
const grade = body('grade').isInt({ min: 1 });
const class_number = body('class_number').isInt({ min: 1 });
const weekday = body('weekday').isInt({ min: 1, max: 7 });
const period_number = body('period_number').isInt({ min: 1 });
const subject_id = body('subject_id').isInt({ min: 1 });
const teacher_id = body('teacher_id').isInt({ min: 1 });
const class_type = body('class_type').isString();
const is_fixed = body('is_fixed').isBoolean();

export const validateCreateTimetable = [
  school_id,
  grade,
  class_number,
  weekday,
  period_number,
  subject_id,
  teacher_id,
  class_type.optional(),
  is_fixed.optional(),
];

export const validateUpdateTimetable = [
  school_id.optional(),
  grade.optional(),
  class_number.optional(),
  weekday.optional(),
  period_number.optional(),
  subject_id.optional(),
  teacher_id.optional(),
  class_type.optional(),
  is_fixed.optional(),
];
