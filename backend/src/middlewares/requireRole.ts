import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { HttpError } from '../utils/httpError';

const roleRank: Record<Role, number> = {
  OWNER: 4,
  ADMIN: 3,
  ACCOUNTING: 2,
  MEMBER: 1
};

export const requireRole = (minimum: Role) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new HttpError(401, 'Unauthorized'));
    return;
  }

  if (roleRank[req.user.role] < roleRank[minimum]) {
    next(new HttpError(403, 'Insufficient role'));
    return;
  }

  next();
};
