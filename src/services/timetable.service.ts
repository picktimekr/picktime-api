import { Op } from 'sequelize';
import { Timetable, Change } from '../models';
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

// --- Advanced Logic: Get Effective Timetable for a specific date ---

/**
 * 특정 학급의 특정 날짜에 대한 최종 시간표를 계산합니다.
 * @param schoolId 학교 ID
 * @param grade 학년
 * @param classNumber 반
 * @param date 조회할 날짜 (YYYY-MM-DD)
 */
export const getEffectiveTimetableForClass = async (
  schoolId: number,
  grade: number,
  classNumber: number,
  date: string
) => {
  // 1. 해당 학급의 기본 주간 시간표를 모두 가져옵니다.
  const baseTimetable = await Timetable.findAll({
    where: {
      school_id: schoolId,
      grade: grade,
      class_number: classNumber,
    },
    raw: true, // 결과를 순수 데이터 객체로 받습니다.
  });

  if (baseTimetable.length === 0) {
    return [];
  }

  // 2. 해당 날짜에 적용될 변경사항들을 모두 가져옵니다.
  const timetableIds = baseTimetable.map((t) => t.id);
  const changes = await Change.findAll({
    where: {
      change_date: date,
      timetable_id: { [Op.in]: timetableIds },
    },
  });

  // 3. 변경사항을 쉽게 찾아볼 수 있도록 Map 형태로 변환합니다.
  const changesMap = new Map();
  changes.forEach((change) => {
    changesMap.set(change.timetable_id, change);
  });

  // 4. 기본 시간표에 변경사항을 덮어씌워 최종 시간표를 만듭니다.
  const effectiveTimetable = baseTimetable.map((slot) => {
    const change = changesMap.get(slot.id);
    if (change) {
      // 변경사항이 있으면, 과목과 선생님 정보를 변경사항의 것으로 교체합니다.
      return {
        ...slot,
        subject_id: change.new_subject_id,
        teacher_id: change.new_teacher_id,
        is_changed: true, // UI에서 변경되었음을 표시하기 위한 플래그
        reason: change.reason,
      };
    }
    return slot; // 변경사항이 없으면 원래 시간표 그대로 반환
  });

  return effectiveTimetable;
};
