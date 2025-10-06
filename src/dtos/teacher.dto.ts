export interface TeacherCreationAttributes {
  name: string;
  school_id: number;
  code?: string | null;
  primary_subject_id?: number | null;
  homeroom_grade?: number | null;
  homeroom_class?: number | null;
}
