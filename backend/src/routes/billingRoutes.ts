import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { requireAuth } from '../middlewares/auth';
import { checkoutSession, portalSession, webhook, subscription } from '../controllers/billingController';

const router = Router();

router.post(
  '/checkout-session',
  requireAuth,
  validate(
    z.object({
      body: z.object({
        email: z.string().email()
      })
    })
  ),
  asyncHandler(checkoutSession)
);

router.post(
  '/portal-session',
  requireAuth,
  validate(
    z.object({
      body: z.object({
        customerId: z.string().min(3)
      })
    })
  ),
  asyncHandler(portalSession)
);

router.post('/webhook', asyncHandler(webhook));
router.get('/subscription', requireAuth, asyncHandler(subscription));

export default router;
