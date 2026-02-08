import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { requirePermission } from '../middlewares/requirePermission';
import { PermissionLevel, Role } from '@prisma/client';
import { list, create, update, remove } from '../controllers/taxController';

const router = Router();

router.get('/', requireAuth, requirePermission('taxes', PermissionLevel.READ), asyncHandler(list));
router.post(
  '/',
  requireAuth,
  requirePermission('taxes', PermissionLevel.WRITE),
  requireRole(Role.ADMIN),
  validate(
    z.object({
      body: z.object({
        name: z.string().min(1),
        percentage: z.number().int().min(0).max(100)
      })
    })
  ),
  asyncHandler(create)
);
router.patch(
  '/:id',
  requireAuth,
  requirePermission('taxes', PermissionLevel.WRITE),
  requireRole(Role.ADMIN),
  validate(
    z.object({
      body: z.object({
        name: z.string().min(1).optional(),
        percentage: z.number().int().min(0).max(100).optional()
      })
    })
  ),
  asyncHandler(update)
);
router.delete(
  '/:id',
  requireAuth,
  requirePermission('taxes', PermissionLevel.WRITE),
  requireRole(Role.ADMIN),
  asyncHandler(remove)
);

export default router;
