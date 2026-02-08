import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middlewares/asyncHandler';
import { validate } from '../middlewares/validate';
import { register, login, refresh, logout, forgotPassword, resetPassword, me } from '../controllers/authController';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post(
  '/register',
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        displayName: z.string().min(2),
        organizationId: z.string().uuid().optional()
      })
    })
  ),
  asyncHandler(register)
);

router.post(
  '/login',
  validate(
    z.object({
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        orgId: z.string().uuid()
      })
    })
  ),
  asyncHandler(login)
);

router.post(
  '/refresh',
  validate(
    z.object({
      body: z.object({
        refreshToken: z.string().min(10),
        orgId: z.string().uuid()
      })
    })
  ),
  asyncHandler(refresh)
);

router.post('/logout', asyncHandler(logout));

router.post(
  '/forgot-password',
  validate(
    z.object({
      body: z.object({
        email: z.string().email()
      })
    })
  ),
  asyncHandler(forgotPassword)
);

router.post(
  '/reset-password',
  validate(
    z.object({
      body: z.object({
        token: z.string().min(10),
        password: z.string().min(8)
      })
    })
  ),
  asyncHandler(resetPassword)
);

router.get('/me', requireAuth, asyncHandler(me));

export default router;
