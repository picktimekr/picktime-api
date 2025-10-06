import Period from '../models/period.model';
import { PeriodCreationAttributes } from '../dtos/period.dto';

// 교시 생성
export const createPeriod = async (data: PeriodCreationAttributes) => {
  const newPeriod = await Period.create(data);
  return newPeriod;
};

// 모든 교시 조회
export const findAllPeriods = async () => {
  const periods = await Period.findAll();
  return periods;
};

// ID로 교시 상세 조회
export const findPeriodById = async (id: number) => {
  const period = await Period.findByPk(id);
  return period;
};

// 학교 ID로 교시 목록 조회
export const findPeriodsBySchoolId = async (schoolId: number) => {
  const periods = await Period.findAll({ where: { school_id: schoolId } });
  return periods;
};

// 교시 정보 수정
export const updatePeriod = async (
  id: number,
  data: Partial<PeriodCreationAttributes>
) => {
  const period = await findPeriodById(id);
  if (!period) {
    return null;
  }
  await period.update(data);
  return period;
};

// 교시 삭제 (Soft Delete)
export const deletePeriod = async (id: number) => {
  const deletedRowCount = await Period.destroy({
    where: { id },
  });
  return deletedRowCount;
};
