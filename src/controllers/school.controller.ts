import { Request, Response } from 'express';
import {
  createSchool,
  findAllSchools,
  findSchoolById,
  updateSchool,
  deleteSchool,
} from '../services/school.service';
import { SchoolCreationAttributes } from '../dtos/school.dto';

// 학교 생성 컨트롤러
export const createSchoolController = async (
  req: Request<{}, {}, SchoolCreationAttributes>,
  res: Response
) => {
  try {
    const schoolData = req.body;
    const newSchool = await createSchool(schoolData);
    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create school', error });
  }
};

// 전체 학교 조회 컨트롤러
export const getAllSchoolsController = async (req: Request, res: Response) => {
  try {
    const schools = await findAllSchools();
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get schools', error });
  }
};

// ID로 학교 상세 조회 컨트롤러
export const getSchoolByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const school = await findSchoolById(id);

    if (!school) {
      return res.status(404).json({ message: `School with id ${id} not found` });
    }

    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get school', error });
  }
};

// 학교 정보 수정 컨트롤러
export const updateSchoolController = async (
  req: Request<{ id: string }, {}, Partial<SchoolCreationAttributes>>,
  res: Response
) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const data = req.body;
    const updatedSchool = await updateSchool(id, data);

    if (!updatedSchool) {
      return res.status(404).json({ message: `School with id ${id} not found` });
    }

    res.status(200).json(updatedSchool);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update school', error });
  }
};

// 학교 삭제 컨트롤러
export const deleteSchoolController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const deletedRowCount = await deleteSchool(id);

    if (deletedRowCount === 0) {
      return res.status(404).json({ message: `School with id ${id} not found` });
    }

    // 성공적으로 삭제되었을 때 204 No Content 응답
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete school', error });
  }
};