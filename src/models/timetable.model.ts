import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/database';

// 모델의 속성을 정의하는 인터페이스
export interface TimetableAttributes {
  id: number;
  school_id: number;
  grade: number;
  class_number: number;
  class_type: string;
  weekday: number;
  period_number: number;
  subject_id: number;
  teacher_id: number;
  is_fixed: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// 생성 시 일부 필드는 선택적이므로 Optional을 사용
interface TimetableCreationAttributes
  extends Optional<TimetableAttributes, 'id' | 'class_type' | 'is_fixed' | 'created_at' | 'updated_at' | 'deleted_at'> {}

class Timetable
  extends Model<TimetableAttributes, TimetableCreationAttributes>
  implements TimetableAttributes
{
  public id!: number;
  public school_id!: number;
  public grade!: number;
  public class_number!: number;
  public class_type!: string;
  public weekday!: number;
  public period_number!: number;
  public subject_id!: number;
  public teacher_id!: number;
  public is_fixed!: boolean;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Timetable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schools',
        key: 'id',
      },
    },
    grade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    class_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'real',
    },
    weekday: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    period_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'id',
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id',
      },
    },
    is_fixed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'timetables',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft delete 활성화
  }
);

export default Timetable;
