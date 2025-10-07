import { Op } from 'sequelize';
import { Timetable, Change, Swap } from '../models';
import { TimetableCreationAttributes } from '../dtos/timetable.dto';

// --- Basic CRUD ---
export const createTimetable = async (data: TimetableCreationAttributes) => Timetable.create(data);
export const findAllTimetables = async () => Timetable.findAll();
export const findTimetableById = async (id: number) => Timetable.findByPk(id);
export const updateTimetable = async (id: number, data: Partial<TimetableCreationAttributes>) => {
  const timetable = await Timetable.findByPk(id);
  if (!timetable) return null;
  return timetable.update(data);
};
export const deleteTimetable = async (id: number) => Timetable.destroy({ where: { id } });

// --- Advanced Logic ---

// 최종 시간표 슬롯을 위한 새로운 타입 정의 (상속 대신 명시적 정의)
interface EffectiveTimetableSlot {
  id: number;
  school_id: number;
  grade: number;
  class_number: number;
  class_type: string;
  weekday: number;
  period_number: number;
  subject_id: number | null;
  teacher_id: number | null;
  is_fixed: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  is_changed?: boolean;
  is_swapped?: boolean;
  reason?: string | null;
}

export const findTimetablesByClass = async (
  schoolId: number,
  grade: number,
  classNumber: number
) => {
  const timetables = await Timetable.findAll({
    where: {
      school_id: schoolId,
      grade: grade,
      class_number: classNumber,
    },
    order: [['weekday', 'ASC'], ['period_number', 'ASC']],
  });
  return timetables;
};
