import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../utils/database';

// 모델의 속성을 정의하는 인터페이스
interface TeacherAttributes {
  id: number;
  code: string | null;
  name: string;
  school_id: number;
  primary_subject_id: number | null;
  homeroom_grade: number | null;
  homeroom_class: number | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

// 생성 시 일부 필드는 선택적이므로 Optional을 사용
interface TeacherCreationAttributes extends Optional<TeacherAttributes, 'id'> {}

class Teacher
  extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes
{
  public id!: number;
  public code!: string | null;
  public name!: string;
  public school_id!: number;
  public primary_subject_id!: number | null;
  public homeroom_grade!: number | null;
  public homeroom_class!: number | null;

  // timestamps
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true, // 스키마에 not null이 없으므로 true로 설정
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schools', // School 모델 객체 대신 테이블 이름(문자열)을 참조
        key: 'id',
      },
    },
    primary_subject_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    homeroom_grade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    homeroom_class: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'teachers',
    timestamps: true,
    underscored: true,
    paranoid: true, // Soft delete 활성화
  }
);

export default Teacher;
