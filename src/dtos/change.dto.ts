// 단순 변경(보결) 요청 시 사용될 데이터 형태
export interface SingleChangeCreationAttributes {
  timetable_id: number;
  change_date: string; // YYYY-MM-DD 형식
  new_subject_id: number;
  new_teacher_id: number;
  reason?: string | null;
  created_by: number; // 이 변경을 요청한 유저의 ID
}
