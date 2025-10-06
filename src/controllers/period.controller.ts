import { Request, Response } from 'express';
import { ForeignKeyConstraintError } from 'sequelize';
import {
  createPeriod,
  findAllPeriods,
  findPeriodById,
  findPeriodsBySchoolId,
  updatePeriod,
  deletePeriod,
} from '../services/period.service';
import { PeriodCreationAttributes } from '../dtos/period.dto';

// 교시 생성
export const createPeriodController = async (
  req: Request<{}, {}, PeriodCreationAttributes>,
  res: Response
) => {
  try {
    const data = req.body;
    const newPeriod = await createPeriod(data);
    res.status(201).json(newPeriod);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: "Creation failed: Invalid school_id.",
        error: `The provided school_id does not exist.`,
      });
    }
    res.status(500).json({ message: 'Failed to create period', error });
  }
};

// 모든 교시 조회
export const getAllPeriodsController = async (req: Request, res: Response) => {
  try {
    const periods = await findAllPeriods();
    res.status(200).json(periods);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get periods', error });
  }
};

// ID로 교시 조회
export const getPeriodByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const period = await findPeriodById(id);
    if (!period) {
      return res.status(404).json({ message: `Period with id ${id} not found` });
    }
    res.status(200).json(period);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get period', error });
  }
};

// 학교 ID로 교시 목록 조회
export const getPeriodsBySchoolIdController = async (req: Request, res: Response) => {
  try {
    const schoolId = parseInt(req.params.schoolId, 10);
    if (isNaN(schoolId)) {
      return res.status(400).json({ message: 'Invalid School ID format' });
    }
    const periods = await findPeriodsBySchoolId(schoolId);
    res.status(200).json(periods);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get periods by school', error });
  }
};

// 교시 정보 수정
export const updatePeriodController = async (
  req: Request<{ id: string }, {}, Partial<PeriodCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const data = req.body;
    const updatedPeriod = await updatePeriod(id, data);
    if (!updatedPeriod) {
      return res.status(404).json({ message: `Period with id ${id} not found` });
    }
    res.status(200).json(updatedPeriod);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        message: "Update failed: Invalid school_id.",
        error: `The provided school_id does not exist.`,
      });
    }
    res.status(500).json({ message: 'Failed to update period', error });
  }
};

// 교시 삭제
export const deletePeriodController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    const deletedRowCount = await deletePeriod(id);
    if (deletedRowCount === 0) {
      return res.status(404).json({ message: `Period with id ${id} not found` });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete period', error });
  }
};
