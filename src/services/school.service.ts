import { School } from '../models';
import { SchoolCreationAttributes } from "../dtos/school.dto";

export const createSchool = async (
  schoolAttributes: SchoolCreationAttributes
) => {
  const newSchool = await School.create(schoolAttributes);
  return newSchool;
};

// 모든 학교 조회
export const findAllSchools = async () => {
  const schools = await School.findAll();
  return schools;
};

// ID로 학교 상세 조회
export const findSchoolById = async (id: number) => {
  const school = await School.findByPk(id);
  return school;
};

// 학교 정보 수정
export const updateSchool = async (
  id: number,
  data: Partial<SchoolCreationAttributes>
) => {
  const school = await findSchoolById(id);
  if (!school) {
    // 컨트롤러에서 처리할 수 있도록 null 또는 에러를 반환할 수 있습니다.
    return null;
  }
  await school.update(data);
  return school;
};

// 학교 삭제 (Soft Delete)
export const deleteSchool = async (id: number) => {
  const deletedRowCount = await School.destroy({
    where: { id },
  });
  return deletedRowCount;
};
