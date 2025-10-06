import Teacher from '../models/teacher.model';
import { TeacherCreationAttributes } from '../dtos/teacher.dto';

// 선생님 생성
export const createTeacher = async (data: TeacherCreationAttributes) => {
  const newTeacher = await Teacher.create(data);
  return newTeacher;
};

// 모든 선생님 조회
export const findAllTeachers = async () => {
  const teachers = await Teacher.findAll();
  return teachers;
};

// ID로 선생님 상세 조회
export const findTeacherById = async (id: number) => {
  const teacher = await Teacher.findByPk(id);
  return teacher;
};

// 학교 ID로 선생님 목록 조회
export const findTeachersBySchoolId = async (schoolId: number) => {
  const teachers = await Teacher.findAll({ where: { school_id: schoolId } });
  return teachers;
};

// 선생님 정보 수정
export const updateTeacher = async (
  id: number,
  data: Partial<TeacherCreationAttributes>
) => {
  const teacher = await findTeacherById(id);
  if (!teacher) {
    return null;
  }
  await teacher.update(data);
  return teacher;
};

// 선생님 삭제 (Soft Delete)
export const deleteTeacher = async (id: number) => {
  const deletedRowCount = await Teacher.destroy({
    where: { id },
  });
  return deletedRowCount;
};
