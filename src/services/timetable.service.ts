import { Timetable } from '../models';
import { TimetableCreationAttributes } from '../dtos/timetable.dto';

// 시간표 항목 생성
export const createTimetable = async (data: TimetableCreationAttributes) => {
  const newTimetable = await Timetable.create(data);
  return newTimetable;
};

// 모든 시간표 항목 조회
export const findAllTimetables = async () => {
  const timetables = await Timetable.findAll();
  return timetables;
};

// ID로 시간표 항목 상세 조회
export const findTimetableById = async (id: number) => {
  const timetable = await Timetable.findByPk(id);
  return timetable;
};

// 특정 학급의 시간표 조회
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

// 시간표 항목 정보 수정
export const updateTimetable = async (
  id: number,
  data: Partial<TimetableCreationAttributes>
) => {
  const timetable = await findTimetableById(id);
  if (!timetable) {
    return null;
  }
  await timetable.update(data);
  return timetable;
};

// 시간표 항목 삭제 (Soft Delete)
export const deleteTimetable = async (id: number) => {
  const deletedRowCount = await Timetable.destroy({
    where: { id },
  });
  return deletedRowCount;
};
