import { DataTypes, Model, Optional, Deferrable } from 'sequelize';
import { sequelize } from '../models'; // 중앙 관리 방식 사용

// 모델의 속성을 정의하는 인터페이스
interface ChangeAttributes {
  id: number;
  timetable_id: number;
  change_date: string;
  change_type: 'single' | 'swap';
  new_subject_id: number | null;
  new_teacher_id: number | null;
  swap_id: number | null;
  reason: string | null;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// 생성 시에는 id가 선택적
interface ChangeCreationAttributes extends Optional<ChangeAttributes, 'id'> {}

class Change
  extends Model<ChangeAttributes, ChangeCreationAttributes>
  implements ChangeAttributes
{
  public id!: number;
  public timetable_id!: number;
  public change_date!: string;
  public change_type!: 'single' | 'swap';
  public new_subject_id!: number | null;
  public new_teacher_id!: number | null;
  public swap_id!: number | null;
  public reason!: string | null;
  public created_by!: number;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Change.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timetable_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'timetables', key: 'id' },
    },
    change_date: {
      type: DataTypes.DATEONLY, // 날짜만 저장
      allowNull: false,
    },
    change_type: {
      type: DataTypes.ENUM('single', 'swap'),
      allowNull: false,
    },
    new_subject_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'subjects', key: 'id' },
    },
    new_teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'teachers', key: 'id' },
    },
    swap_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'swaps', key: 'id' },
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'changes',
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default Change;
