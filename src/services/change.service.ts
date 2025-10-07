import { sequelize, Change, Swap, Timetable } from '../models';
import {
  SingleChangeCreationAttributes,
  SwapChangeCreationAttributes,
} from '../dtos/change.dto';

/**
 * 1. 단순 변경 (보결) 생성
 * @param data 단순 변경 생성 데이터
 */
export const createSingleChange = async (data: SingleChangeCreationAttributes) => {
  const change = await Change.create({
    ...data,
    change_type: 'single',
  });
  return change;
};

/**
 * 2. 맞교환 생성 (트랜잭션 사용)
 * @param data 맞교환 생성 데이터
 */
export const createSwapChange = async (data: SwapChangeCreationAttributes) => {
  const result = await sequelize.transaction(async (t) => {
    // 1. 검증 로직
    const timetable1 = await Timetable.findByPk(data.timetable1_id, { transaction: t });
    const timetable2 = await Timetable.findByPk(data.timetable2_id, { transaction: t });

    if (!timetable1 || !timetable2) { throw new Error('One or both timetable entries not found.'); }
    if (timetable1.id === timetable2.id) { throw new Error('Cannot swap a timetable entry with itself.'); }
    if (timetable1.school_id !== data.school_id || timetable2.school_id !== data.school_id) { throw new Error('Both timetable entries must belong to the specified school.'); }
    if (timetable1.teacher_id === timetable2.teacher_id) { throw new Error('Cannot swap classes of the same teacher.'); }

    // 2. 맞교환(Swap) 기록을 먼저 생성합니다.
    const newSwap = await Swap.create(
      {
        school_id: data.school_id,
        swap_date: data.swap_date,
        teacher1_id: timetable1.teacher_id,
        teacher2_id: timetable2.teacher_id,
        timetable1_id: data.timetable1_id,
        timetable2_id: data.timetable2_id,
        created_by: data.created_by,
      },
      { transaction: t }
    );

    // 3. 두 개의 변경(Change) 기록을 생성합니다. (swap_id는 아직 null)
    const change1 = await Change.create(
      {
        timetable_id: timetable1.id,
        change_date: data.swap_date,
        change_type: 'swap',
        new_subject_id: timetable2.subject_id,
        new_teacher_id: timetable2.teacher_id,
        swap_id: null, // 일단 null로 생성
        reason: data.reason,
        created_by: data.created_by,
      },
      { transaction: t }
    );

    const change2 = await Change.create(
      {
        timetable_id: timetable2.id,
        change_date: data.swap_date,
        change_type: 'swap',
        new_subject_id: timetable1.subject_id,
        new_teacher_id: timetable1.teacher_id,
        swap_id: null, // 일단 null로 생성
        reason: data.reason,
        created_by: data.created_by,
      },
      { transaction: t }
    );

    // 4. 생성된 변경 기록들에 newSwap.id를 업데이트하여 관계를 설정합니다.
    await change1.update({ swap_id: newSwap.id }, { transaction: t });
    await change2.update({ swap_id: newSwap.id }, { transaction: t });

    return newSwap;
  });

  return result;
};
