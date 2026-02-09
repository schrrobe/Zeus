import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';
import { Role } from '@prisma/client';
import {
  getInvoiceNumberingSetting,
  getQuoteNumberingSetting,
  updateInvoiceNumberingSetting,
  updateQuoteNumberingSetting
} from '../controllers/settingsController';

const router = Router();

router.get('/invoice-numbering', requireAuth, asyncHandler(getInvoiceNumberingSetting));
router.get('/quote-numbering', requireAuth, asyncHandler(getQuoteNumberingSetting));
router.patch(
  '/invoice-numbering',
  requireAuth,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      body: z.object({
        prefix: z.string().min(1).optional(),
        nextNumber: z.number().int().positive().optional(),
        resetYearly: z.boolean().optional(),
        startNumber: z.number().int().positive().optional(),
        minDigits: z.number().int().positive().optional()
      })
    })
  ),
  asyncHandler(updateInvoiceNumberingSetting)
);
router.patch(
  '/quote-numbering',
  requireAuth,
  requireRole(Role.ADMIN),
  validate(
    z.object({
      body: z.object({
        prefix: z.string().min(1).optional(),
        nextNumber: z.number().int().positive().optional(),
        resetYearly: z.boolean().optional(),
        startNumber: z.number().int().positive().optional(),
        minDigits: z.number().int().positive().optional()
      })
    })
  ),
  asyncHandler(updateQuoteNumberingSetting)
);

export default router;
