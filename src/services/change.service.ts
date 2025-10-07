import { Change } from '../models';
import { SingleChangeCreationAttributes } from '../dtos/change.dto';

/**
 * 단순 변경 (보결) 생성
 * @param data 단순 변경 생성 데이터
 */
export const createSingleChange = async (data: SingleChangeCreationAttributes) => {
  const change = await Change.create(data);
  return change;
};

/**
 * 모든 단순 변경 조회 (필터링 가능)
 * @param query 필터링 쿼리
 */
export const findAllChanges = async (query: any) => {
  const changes = await Change.findAll({ where: query });
  return changes;
};
