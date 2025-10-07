// src/index.ts
import express from 'express';
import sequelize from './utils/database';
import { serverConfig } from './config/config';
import mainRouter from './routes';
import { loggingMiddleware } from './middlewares/logging.middleware';
import errorMiddleware from './middlewares/error.middleware';
const { NotFoundError } = require('./errors');

const app = express();

// Middlewares
app.use(express.json()); // JSON body parser
app.use(loggingMiddleware); // Logging middleware

// public 폴더의 정적 파일(index.html 등)을 서비스합니다.
app.use(express.static('public'));

// Routes
app.use('/api', mainRouter);

// Error Middleware
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // In development, you might want to use sync({ force: true }) to re-create tables.
    await sequelize.sync(); 
    console.log('All models were synchronized successfully.');

    app.listen(serverConfig.port, () => {
      console.log(`Server is running on http://localhost:${serverConfig.port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();