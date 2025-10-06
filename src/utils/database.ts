
// src/utils/database.ts
import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/config';

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

export default sequelize;
