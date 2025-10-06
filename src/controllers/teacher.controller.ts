import { Request, Response } from 'express';
import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from 'sequelize';
import {
  createTeacher,
  findAllTeachers,
  findTeacherById,
  findTeachersBySchoolId, // 추가
  updateTeacher,
  deleteTeacher,
} from '../services/teacher.service';
import { TeacherCreationAttributes } from '../dtos/teacher.dto';

// 선생님 생성
export const createTeacherController = async (
  req: Request<{}, {}, TeacherCreationAttributes>,
  res: Response
) => {
  try {
    const teacherData = req.body;
    const newTeacher = await createTeacher(teacherData);
    res.status(201).json(newTeacher);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        message: "Creation failed due to a conflict.",
        error: "A teacher with the same unique value already exists.",
        fields: error.fields,
      });
    }
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: "Creation failed due to invalid foreign key.",
        error: `The provided school_id does not exist.`,
        fields: error.fields,
      });
    }
    res.status(500).json({ message: 'Failed to create teacher', error });
  }
};

// 모든 선생님 조회
export const getAllTeachersController = async (req: Request, res: Response) => {
  try {
    const teachers = await findAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get teachers', error });
  }
};

// ID로 선생님 조회
export const getTeacherByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const teacher = await findTeacherById(id);
    if (!teacher) {
      return res.status(404).json({ message: `Teacher with id ${id} not found` });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get teacher', error });
  }
};

// 학교 ID로 선생님 목록 조회
export const getTeachersBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    if (isNaN(schoolId)) {
      return res.status(400).json({ message: 'Invalid School ID format' });
    }
    const teachers = await findTeachersBySchoolId(schoolId);
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get teachers by school', error });
  }
};

// 선생님 정보 수정
export const updateTeacherController = async (
  req: Request<{ id: string }, {}, Partial<TeacherCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const data = req.body;
    const updatedTeacher = await updateTeacher(id, data);
    if (!updatedTeacher) {
      return res.status(404).json({ message: `Teacher with id ${id} not found` });
    }
    res.status(200).json(updatedTeacher);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        message: 'Update failed due to a conflict.',
        error: 'A teacher with the same unique value already exists.',
        fields: error.fields,
      });
    }
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: "Update failed due to invalid foreign key.",
        error: `The provided school_id does not exist.`,
        fields: error.fields,
      });
    }
    res.status(500).json({ message: 'Failed to update teacher', error });
  }
};

// 선생님 삭제
export const deleteTeacherController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const deletedRowCount = await deleteTeacher(id);
    if (deletedRowCount === 0) {
      return res.status(404).json({ message: `Teacher with id ${id} not found` });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete teacher', error });
  }
};

