
// src/models/user.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../utils/database';

// 모델의 속성을 정의하는 인터페이스
interface UserAttributes {
  id?: number; // id를 선택적 필드로 변경
  name: string;
  email: string;
}

// Sequelize 모델 클래스
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
    underscored: true,
    paranoid: true // Soft delete 활성화
  }
);

export default User;
