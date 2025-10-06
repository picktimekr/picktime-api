import Subject from '../models/subject.model';
import { SubjectCreationAttributes } from '../dtos/subject.dto';

// 과목 생성
export const createSubject = async (data: SubjectCreationAttributes) => {
  const newSubject = await Subject.create(data);
  return newSubject;
};

// 모든 과목 조회
export const findAllSubjects = async () => {
  const subjects = await Subject.findAll();
  return subjects;
};

// ID로 과목 상세 조회
export const findSubjectById = async (id: number) => {
  const subject = await Subject.findByPk(id);
  return subject;
};

// 학교 ID로 과목 목록 조회
export const findSubjectsBySchoolId = async (schoolId: number) => {
  const subjects = await Subject.findAll({ where: { school_id: schoolId } });
  return subjects;
};

// 과목 정보 수정
export const updateSubject = async (
  id: number,
  data: Partial<SubjectCreationAttributes>
) => {
  const subject = await findSubjectById(id);
  if (!subject) {
    return null;
  }
  await subject.update(data);
  return subject;
};

// 과목 삭제 (Soft Delete)
export const deleteSubject = async (id: number) => {
  const deletedRowCount = await Subject.destroy({
    where: { id },
  });
  return deletedRowCount;
};
