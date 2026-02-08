import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { PermissionLevel } from '@prisma/client';
import { HttpError } from '../utils/httpError';

export const requirePermission = (featureKey: string, level: PermissionLevel) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new HttpError(401, 'Unauthorized'));
      return;
    }

    if (req.user.role === 'OWNER' || req.user.role === 'ADMIN') {
      next();
      return;
    }

    const membership = await prisma.membership.findUnique({
      where: { organizationId_userId: { organizationId: req.user.orgId, userId: req.user.id } },
      include: { permissions: true }
    });

    if (!membership) {
      next(new HttpError(403, 'No membership'));
      return;
    }

    const permission = membership.permissions.find((perm) => perm.featureKey === featureKey);
    if (!permission) {
      next(new HttpError(403, 'Missing permission'));
      return;
    }

    const rank = {
      [PermissionLevel.NONE]: 0,
      [PermissionLevel.READ]: 1,
      [PermissionLevel.WRITE]: 2
    };

    if (rank[permission.level] < rank[level]) {
      next(new HttpError(403, 'Insufficient permission'));
      return;
    }

    next();
  };
