import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/database";

interface SchoolAttribute {
  id?: number; // id를 선택적 필드로 변경
  code: string;
  name: string;
  region: string;
  type: string;
  max_grade: number;
  max_real_class: number;
  max_virtual_class: number;
}

// Sequelize 모델 클래스
class School extends Model<SchoolAttribute> implements SchoolAttribute {
  public id!: number;
  public code!: string;
  public name!: string;
  public region!: string;
  public type!: string;
  public max_grade!: number;
  public max_real_class!: number;
  public max_virtual_class!: number;
}

School.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_grade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_real_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_virtual_class: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "schools",
    timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
    underscored: true,
    paranoid: true, // soft delete를 위해 paranoid 옵션 추가
  }
);

export default School;
