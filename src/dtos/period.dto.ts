export interface PeriodCreationAttributes {
  school_id: number;
  weekday: number; // 1: Monday, 2: Tuesday, ... 7: Sunday
  period_number: number;
  start_time: string; // "HH:mm:ss" format, e.g., "09:00:00"
  end_time: string;   // "HH:mm:ss" format, e.g., "09:50:00"
}
