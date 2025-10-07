import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../models'; // 중앙 관리 방식 사용

// 모델의 속성을 정의하는 인터페이스
interface SwapAttributes {
  id: number;
  school_id: number;
  swap_date: string;
  teacher1_id: number;
  teacher2_id: number;
  timetable1_id: number;
  timetable2_id: number;
  created_by: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// 생성 시에는 id가 선택적
interface SwapCreationAttributes extends Optional<SwapAttributes, 'id'> {}

class Swap
  extends Model<SwapAttributes, SwapCreationAttributes>
  implements SwapAttributes
{
  public id!: number;
  public school_id!: number;
  public swap_date!: string;
  public teacher1_id!: number;
  public teacher2_id!: number;
  public timetable1_id!: number;
  public timetable2_id!: number;
  public created_by!: number;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Swap.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'schools', key: 'id' },
    },
    swap_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    teacher1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'teachers', key: 'id' },
    },
    teacher2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'teachers', key: 'id' },
    },
    timetable1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'timetables', key: 'id' },
    },
    timetable2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'timetables', key: 'id' },
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
  },
  {
    sequelize,
    tableName: 'swaps',
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

export default Swap;
