import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/tokenService';
import { HttpError } from '../utils/httpError';
import { prisma } from '../lib/prisma';

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(new HttpError(401, 'Missing authorization header'));
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const payload = verifyAccessToken(token);

  const orgId = typeof req.headers['x-org-id'] === 'string' ? req.headers['x-org-id'] : payload.orgId;
  if (!orgId) {
    next(new HttpError(400, 'Missing organization context'));
    return;
  }

  const membership = await prisma.membership.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId: payload.sub } }
  });

  if (!membership || !membership.isActive) {
    next(new HttpError(403, 'No organization access'));
    return;
  }

  req.user = {
    id: payload.sub,
    orgId,
    role: membership.role
  };

  next();
};
