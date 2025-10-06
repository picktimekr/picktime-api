import { NextFunction, Request, Response } from 'express';

interface StatusError extends Error {
  status?: number;
}

const errorMiddleware = (
  err: StatusError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  
  res.status(status).json({
    status,
    message,
  });
};

export default errorMiddleware;
