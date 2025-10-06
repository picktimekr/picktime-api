import { Request, Response } from 'express';
import {
  UniqueConstraintError,
  ForeignKeyConstraintError,
} from 'sequelize';
import {
  createSubject,
  findAllSubjects,
  findSubjectById,
  findSubjectsBySchoolId,
  updateSubject,
  deleteSubject,
} from '../services/subject.service';
import { SubjectCreationAttributes } from '../dtos/subject.dto';

// 과목 생성
export const createSubjectController = async (
  req: Request<{}, {}, SubjectCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newSubject = await createSubject(data);
    res.status(201).json(newSubject);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: "Creation failed: Invalid school_id.",
        error: `The provided school_id does not exist.`,
      });
    }
    // Unique constraint error는 이 모델에 unique 필드가 없으므로 일단 제외합니다.
    res.status(500).json({ message: 'Failed to create subject', error });
  }
};

// 모든 과목 조회
export const getAllSubjectsController = async (req: Request, res: Response) => {
  try {
    const subjects = await findAllSubjects();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get subjects', error });
  }
};

// ID로 과목 조회
export const getSubjectByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const subject = await findSubjectById(id);
    if (!subject) {
      return res.status(404).json({ message: `Subject with id ${id} not found` });
    }
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get subject', error });
  }
};

// 학교 ID로 과목 목록 조회
export const getSubjectsBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    if (isNaN(schoolId)) {
      return res.status(400).json({ message: 'Invalid School ID format' });
    }
    const subjects = await findSubjectsBySchoolId(schoolId);
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get subjects by school', error });
  }
};

// 과목 정보 수정
export const updateSubjectController = async (
  req: Request<{ id: string }, {}, Partial<SubjectCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const data = req.body;
    const updatedSubject = await updateSubject(id, data);
    if (!updatedSubject) {
      return res.status(404).json({ message: `Subject with id ${id} not found` });
    }
    res.status(200).json(updatedSubject);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: 'Update failed: Invalid school_id.',
        error: `The provided school_id does not exist.`,
      });
    }
    res.status(500).json({ message: 'Failed to update subject', error });
  }
};

// 과목 삭제
export const deleteSubjectController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const deletedRowCount = await deleteSubject(id);
    if (deletedRowCount === 0) {
      return res.status(404).json({ message: `Subject with id ${id} not found` });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete subject', error });
  }
};
