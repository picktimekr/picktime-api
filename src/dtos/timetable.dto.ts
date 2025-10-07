export interface TimetableCreationAttributes {
  school_id: number;
  grade: number;
  class_number: number;
  weekday: number;
  period_number: number;
  subject_id: number;
  teacher_id: number;
  class_type?: string;
  is_fixed?: boolean;
}
