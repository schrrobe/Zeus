import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { requirePermission } from '../middlewares/requirePermission';
import { PermissionLevel, Role } from '@prisma/client';
import { list, detail, create, update, remove, addNote } from '../controllers/customerController';

const router = Router();

router.get(
  '/',
  requireAuth,
  requirePermission('customers', PermissionLevel.READ),
  validate(
    z.object({
      query: z.object({
        page: z.coerce.number().int().positive().optional(),
        perPage: z.coerce.number().int().positive().max(100).optional()
      })
    })
  ),
  asyncHandler(list)
);
router.get('/:id', requireAuth, requirePermission('customers', PermissionLevel.READ), asyncHandler(detail));
router.post(
  '/',
  requireAuth,
  requirePermission('customers', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2),
        email: z.string().email().optional(),
        address: z.string().optional(),
        contactPerson: z.string().optional(),
        phone: z.string().optional()
      })
    })
  ),
  asyncHandler(create)
);
router.patch(
  '/:id',
  requireAuth,
  requirePermission('customers', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        name: z.string().min(2).optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        contactPerson: z.string().optional(),
        phone: z.string().optional()
      })
    })
  ),
  asyncHandler(update)
);
router.delete(
  '/:id',
  requireAuth,
  requirePermission('customers', PermissionLevel.WRITE),
  requireRole(Role.ADMIN),
  asyncHandler(remove)
);
router.post(
  '/:id/notes',
  requireAuth,
  requirePermission('customers', PermissionLevel.WRITE),
  validate(
    z.object({
      body: z.object({
        content: z.string().min(2)
      })
    })
  ),
  asyncHandler(addNote)
);

export default router;
