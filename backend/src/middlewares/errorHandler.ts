import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';
import logger from '../utils/logger';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const status = err instanceof HttpError ? err.status : 500;
  const payload = {
    error: err.message || 'Internal Server Error',
    details: err instanceof HttpError ? err.details : undefined
  };

  if (status >= 500) {
    logger.error({ err }, 'Unhandled error');
  }

  res.status(status).json(payload);
};
