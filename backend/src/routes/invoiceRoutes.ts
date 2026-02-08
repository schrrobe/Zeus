import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { requirePermission } from '../middlewares/requirePermission';
import { PermissionLevel, Role, InvoiceType } from '@prisma/client';
import { list, detail, create, createFromQuote, issue, remove, payment, sendInvoice, pdf, eInvoice } from '../controllers/invoiceController';

const router = Router();

router.get('/', requireAuth, requirePermission('invoices', PermissionLevel.READ), asyncHandler(list));
router.get('/:id', requireAuth, requirePermission('invoices', PermissionLevel.READ), asyncHandler(detail));
router.post(
  '/',
  requireAuth,
  requirePermission('invoices', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        customerId: z.string().uuid(),
        type: z.nativeEnum(InvoiceType),
        dueAt: z.string().datetime().optional(),
        discountCents: z.number().int().nonnegative().optional(),
        lines: z
          .array(
            z.object({
              description: z.string().min(1),
              quantity: z.number().int().positive(),
              unitPrice: z.number().int().nonnegative(),
              taxRateId: z.string().uuid().optional(),
              taxRatePercent: z.number().int().min(0).max(100).optional()
            })
          )
          .min(1)
      })
    })
  ),
  asyncHandler(create)
);
router.post(
  '/from-quote/:quoteId',
  requireAuth,
  requirePermission('invoices', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      params: z.object({
        quoteId: z.string().uuid()
      })
    })
  ),
  asyncHandler(createFromQuote)
);
router.post(
  '/:id/issue',
  requireAuth,
  requirePermission('invoices', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  asyncHandler(issue)
);
router.post(
  '/:id/payments',
  requireAuth,
  requirePermission('invoices', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  validate(
    z.object({
      body: z.object({
        amountCents: z.number().int().positive(),
        method: z.string().min(1),
        reference: z.string().optional()
      })
    })
  ),
  asyncHandler(payment)
);
router.post(
  '/:id/send',
  requireAuth,
  requirePermission('invoices', PermissionLevel.WRITE),
  requireRole(Role.ACCOUNTING),
  asyncHandler(sendInvoice)
);
router.get('/:id/pdf', requireAuth, requirePermission('invoices', PermissionLevel.READ), asyncHandler(pdf));
router.get('/:id/erechnung', requireAuth, requirePermission('invoices', PermissionLevel.READ), asyncHandler(eInvoice));
router.delete(
  '/:id',
  requireAuth,
  requirePermission('invoices', PermissionLevel.WRITE),
  requireRole(Role.ADMIN),
  asyncHandler(remove)
);

export default router;
