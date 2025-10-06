import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/database';

// 모델의 속성을 정의하는 인터페이스
interface SubjectAttributes {
  id: number;
  school_id: number;
  name: string;
  short_name: string;
  code: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// 생성 시 일부 필드는 선택적이므로 Optional을 사용
interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

class Subject
  extends Model<SubjectAttributes, SubjectCreationAttributes>
  implements SubjectAttributes
{
  public id!: number;
  public school_id!: number;
  public name!: string;
  public short_name!: string;
  public code!: string | null;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Subject.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    short_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'subjects',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft delete 활성화
  }
);

export default Subject;
