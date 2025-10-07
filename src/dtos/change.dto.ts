// 단순 변경(보결) 요청 시 사용될 데이터 형태
export interface SingleChangeCreationAttributes {
  timetable_id: number;
  change_date: string; // YYYY-MM-DD 형식
  new_subject_id: number;
  new_teacher_id: number;
  reason?: string | null;
  created_by: number; // 이 변경을 요청한 유저의 ID
}

// 맞교환 요청 시 사용될 데이터 형태
export interface SwapChangeCreationAttributes {
  school_id: number;
  swap_date: string; // YYYY-MM-DD 형식
  timetable1_id: number; // 바꿀 첫 번째 시간표 항목 ID
  timetable2_id: number; // 바꿀 두 번째 시간표 항목 ID
  reason?: string | null;
  created_by: number; // 이 변경을 요청한 유저의 ID
}
