import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { requirePermission } from '../middlewares/requirePermission';
import { PermissionLevel, Role, QuoteStatus } from '@prisma/client';
import { list, detail, create, updateStatus, remove } from '../controllers/quoteController';

const router = Router();

router.get('/', requireAuth, requirePermission('quotes', PermissionLevel.READ), asyncHandler(list));
router.get('/:id', requireAuth, requirePermission('quotes', PermissionLevel.READ), asyncHandler(detail));
router.post(
  '/',
  requireAuth,
  requirePermission('quotes', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        customerId: z.string().uuid(),
        validUntil: z.string().datetime().optional(),
        lines: z
          .array(
            z.object({
              description: z.string().min(1),
              quantity: z.number().int().positive(),
              unitPrice: z.number().int().nonnegative(),
              taxRatePercent: z.number().int().min(0).max(100).optional(),
              taxRateId: z.string().uuid().optional()
            })
          )
          .min(1)
      })
    })
  ),
  asyncHandler(create)
);
router.patch(
  '/:id/status',
  requireAuth,
  requirePermission('quotes', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        status: z.nativeEnum(QuoteStatus)
      })
    })
  ),
  asyncHandler(updateStatus)
);
router.delete(
  '/:id',
  requireAuth,
  requirePermission('quotes', PermissionLevel.WRITE),
  requireRole(Role.ADMIN),
  asyncHandler(remove)
);

export default router;
