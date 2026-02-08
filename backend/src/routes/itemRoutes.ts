import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { requirePermission } from '../middlewares/requirePermission';
import { PermissionLevel, Role } from '@prisma/client';
import { list, detail, create, update, remove } from '../controllers/itemController';

const router = Router();

router.get('/', requireAuth, requirePermission('items', PermissionLevel.READ), asyncHandler(list));
router.get('/:id', requireAuth, requirePermission('items', PermissionLevel.READ), asyncHandler(detail));
router.post(
  '/',
  requireAuth,
  requirePermission('items', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        priceCents: z.number().int().nonnegative(),
        unit: z.string().min(1),
        taxRateId: z.string().uuid().optional()
      })
    })
  ),
  asyncHandler(create)
);
router.patch(
  '/:id',
  requireAuth,
  requirePermission('items', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        priceCents: z.number().int().nonnegative().optional(),
        unit: z.string().min(1).optional(),
        taxRateId: z.string().uuid().optional()
      })
    })
  ),
  asyncHandler(update)
);
router.delete('/:id', requireAuth, requirePermission('items', PermissionLevel.WRITE), requireRole(Role.ADMIN), asyncHandler(remove));

export default router;
