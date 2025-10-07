import { Request, Response } from 'express';
import {
  ForeignKeyConstraintError,
} from 'sequelize';
import {
  createTimetable,
  findAllTimetables,
  findTimetableById,
  findTimetablesByClass,
  updateTimetable,
  deleteTimetable,
} from '../services/timetable.service';
import { TimetableCreationAttributes } from '../dtos/timetable.dto';

// 시간표 항목 생성
export const createTimetableController = async (
  req: Request<{}, {}, TimetableCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newTimetable = await createTimetable(data);
    res.status(201).json(newTimetable);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: "Creation failed due to invalid foreign key.",
        error: `The provided school_id, subject_id, or teacher_id does not exist.`,
        fields: error.fields,
      });
    }
    res.status(500).json({ message: 'Failed to create timetable entry', error });
  }
};

// 모든 시간표 항목 조회
export const getAllTimetablesController = async (req: Request, res: Response) => {
  try {
    const timetables = await findAllTimetables();
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get timetable entries', error });
  }
};

// ID로 시간표 항목 조회
export const getTimetableByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const timetable = await findTimetableById(id);
    if (!timetable) {
      return res.status(404).json({ message: `Timetable entry with id ${id} not found` });
    }
    res.status(200).json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get timetable entry', error });
  }
};

// 특정 학급의 시간표 조회
export const getTimetablesByClassController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    const grade = parseInt(req.params.grade, 10);
    const classNumber = parseInt(req.params.classNumber, 10);

    if (isNaN(schoolId) || isNaN(grade) || isNaN(classNumber)) {
      return res.status(400).json({ message: 'Invalid ID format for school, grade, or class number' });
    }
    const timetables = await findTimetablesByClass(schoolId, grade, classNumber);
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get timetables by class', error });
  }
};


// 시간표 항목 정보 수정
export const updateTimetableController = async (
  req: Request<{ id: string }, {}, Partial<TimetableCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const data = req.body;
    const updatedTimetable = await updateTimetable(id, data);
    if (!updatedTimetable) {
      return res.status(404).json({ message: `Timetable entry with id ${id} not found` });
    }
    res.status(200).json(updatedTimetable);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: "Update failed due to invalid foreign key.",
        error: `The provided school_id, subject_id, or teacher_id does not exist.`,
        fields: error.fields,
      });
    }
    res.status(500).json({ message: 'Failed to update timetable entry', error });
  }
};

// 시간표 항목 삭제
export const deleteTimetableController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const deletedRowCount = await deleteTimetable(id);
    if (deletedRowCount === 0) {
      return res.status(404).json({ message: `Timetable entry with id ${id} not found` });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete timetable entry', error });
  }
};
