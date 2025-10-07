import { Swap, Timetable } from '../models';
import { SwapCreationAttributes } from '../dtos/swap.dto';

/**
 * 맞교환(Swap) 생성
 * @param data 맞교환 생성 데이터 (teacher IDs 없음)
 */
export const createSwap = async (data: SwapCreationAttributes) => {
  // 1. 전달받은 timetable ID로 실제 시간표 데이터를 조회합니다.
  const timetable1 = await Timetable.findByPk(data.timetable1_id);
  const timetable2 = await Timetable.findByPk(data.timetable2_id);

  // 2. 서비스 레벨에서 데이터의 정합성을 검증합니다.
  if (!timetable1 || !timetable2) {
    throw new Error('One or both timetable entries not found.');
  }
  if (timetable1.get('id') === timetable2.get('id')) {
    throw new Error('Cannot swap a timetable entry with itself.');
  }
  if (timetable1.get('school_id') !== data.school_id || timetable2.get('school_id') !== data.school_id) {
    throw new Error('Both timetable entries must belong to the specified school.');
  }
  if (timetable1.get('teacher_id') === timetable2.get('teacher_id')) {
    throw new Error('Cannot swap classes of the same teacher.');
  }

  // 3. 조회한 데이터를 바탕으로 완전한 Swap 데이터를 만들어 생성합니다.
  const fullSwapData = {
    ...data,
    teacher1_id: timetable1.get('teacher_id'),
    teacher2_id: timetable2.get('teacher_id'),
  };

  const swap = await Swap.create(fullSwapData);
  return swap;
};

/**
 * 모든 맞교환 조회 (필터링 가능)
 * @param query 필터링 쿼리
 */
export const findAllSwaps = async (query: any) => {
  const swaps = await Swap.findAll({ where: query });
  return swaps;
};