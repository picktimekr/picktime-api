import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/database';

interface PeriodAttributes {
  id: number;
  school_id: number;
  weekday: number;
  period_number: number;
  start_time: string; // TIME 필드는 'HH:mm:ss' 형식의 문자열로 다룹니다.
  end_time: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

interface PeriodCreationAttributes extends Optional<PeriodAttributes, 'id'> {}

class Period
  extends Model<PeriodAttributes, PeriodCreationAttributes>
  implements PeriodAttributes
{
  public id!: number;
  public school_id!: number;
  public weekday!: number;
  public period_number!: number;
  public start_time!: string;
  public end_time!: string;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Period.init(
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
    weekday: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    period_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'periods',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft delete 활성화
  }
);

export default Period;
