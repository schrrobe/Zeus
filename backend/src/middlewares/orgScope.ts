import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';

export const requireOrgMatch = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new HttpError(401, 'Unauthorized'));
    return;
  }

  const orgId = req.params.orgId || req.user.orgId;
  if (orgId !== req.user.orgId) {
    next(new HttpError(403, 'Organization mismatch'));
    return;
  }

  next();
};
